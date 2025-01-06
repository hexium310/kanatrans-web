use http::StatusCode;

#[derive(thiserror::Error, Debug)]
pub(crate) enum ErrorKind {
    #[error("Requet Error: {0}")]
    Http(StatusCode),
    #[error("Internal Error, caused by {source}")]
    InternalError {
        #[source]
        source: anyhow::Error,
    },
}
