use http::{uri::InvalidUri, Method, Request, Response, StatusCode};
use http_body_util::{BodyExt, Empty};
use problem_details::ProblemDetails;
use service::{Body, Bytes, Router as AxumRouter};
use tower::ServiceExt;

use crate::output::Output;

pub(crate) struct Router {
    inner: AxumRouter,
}

impl Router {
    pub fn new(router: AxumRouter) -> Self {
        Self { inner: router }
    }

    pub async fn apply(&self, uri: impl Into<String>) -> Output {
        let response = match self.request(uri).await {
            Ok(response) => response,
            Err(err) if err.is::<InvalidUri>() => {
                return Output::Failure(ProblemDetails::from_status_code(StatusCode::BAD_REQUEST).with_detail(err.to_string()))
            },
            Err(err) => {
                return Output::Failure(ProblemDetails::from_status_code(StatusCode::INTERNAL_SERVER_ERROR).with_detail(err.to_string()))
            },
        };

        let status = response.status();
        let body = match response.into_body().collect().await {
            Ok(body) => body,
            Err(err) => return Output::Failure(ProblemDetails::from_status_code(status).with_detail(err.to_string()))
        };

        if !status.is_success() {
            return Output::Failure(serde_json::from_slice::<ProblemDetails>(&body.to_bytes()).expect("Invalid kanatrans error response as ProblemDetails"))
        }

        Output::Success(body.to_bytes())
    }

    pub async fn request(&self, uri: impl Into<String>) -> Result<Response<Body>, http::Error> {
        let req = Request::builder()
            .method(Method::GET)
            .uri(uri.into())
            .body(Empty::<Bytes>::new())?;
        let response = self.inner.clone().oneshot(req).await.expect("Infallible: oneshot");

        Ok(response)
    }
}
