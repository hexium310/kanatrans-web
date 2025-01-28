use http::StatusCode;
use serde::Serialize;

use crate::{error::ErrorKind, service_response::ServiceResponse};

#[derive(Debug, Serialize)]
pub(crate) struct ErrorResponse {
    pub(crate) error: ErrorResponseBody,
}

#[derive(Debug, Serialize)]
pub(crate) struct ErrorResponseBody {
    status: u16,
    message: String,
}

impl ServiceResponse for ErrorResponse {}

impl From<ErrorKind> for ErrorResponseBody {
    fn from(error_kind: ErrorKind) -> Self {
        match error_kind {
            ErrorKind::Http(status_code) => match status_code {
                StatusCode::NOT_FOUND => ErrorResponseBody {
                    status: status_code.into(),
                    message: "Not Found".to_owned(),
                },
                StatusCode::BAD_REQUEST => ErrorResponseBody {
                    status: status_code.into(),
                    message: "Bad Request".to_owned(),
                },
                _ => unreachable!(),
            },
            ErrorKind::InternalError { source } => ErrorResponseBody {
                status: StatusCode::INTERNAL_SERVER_ERROR.into(),
                message: source.to_string(),
            },
        }
    }
}
