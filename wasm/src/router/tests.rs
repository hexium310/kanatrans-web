use axum::routing;
use http::StatusCode;
use problem_details::ProblemDetails;
use service::Router as AxumRouter;

use crate::{output::Output, Router};

fn axum_router() -> AxumRouter {
    AxumRouter::new()
        .route("/success", routing::get(async || { "success" }))
        .route("/failure", routing::get(async || { ProblemDetails::from_status_code(StatusCode::INTERNAL_SERVER_ERROR) }))
}

#[tokio::test(flavor = "current_thread")]
async fn ok() {
    let router = Router::new(axum_router());

    let output = router.apply("/success").await;

    assert_eq!(output, Output::Success("success".into()));
}

#[tokio::test(flavor = "current_thread")]
async fn internal_server_error() {
    let router = Router::new(axum_router());

    let output = router.apply("/failure").await;

    assert_eq!(output, Output::Failure(ProblemDetails::from_status_code(StatusCode::INTERNAL_SERVER_ERROR)));
}

#[tokio::test(flavor = "current_thread")]
async fn not_found() {
    let router = Router::new(axum_router());

    let output = router.apply("/does-not-exist").await;

    assert_eq!(output, Output::Failure(ProblemDetails::from_status_code(StatusCode::NOT_FOUND)));
}

#[tokio::test(flavor = "current_thread")]
async fn bad_request() {
    let router = Router::new(axum_router());

    let output = router.apply("").await;

    assert_eq!(output, Output::Failure(ProblemDetails::from_status_code(StatusCode::BAD_REQUEST).with_detail("empty string")));
}
