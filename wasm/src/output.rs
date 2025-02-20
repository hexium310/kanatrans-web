use std::io::{BufWriter, Write};

use http::StatusCode;
use problem_details::ProblemDetails;
use serde::Serialize;
use service::Bytes;

#[derive(Debug, PartialEq, Eq)]
pub(crate) enum Output {
    Success(Bytes),
    Failure(ProblemDetails),
}

impl Output {
    pub(crate) fn write<W: Write>(&self, writer: &mut W) {
        let (status, body) = match self {
            Self::Success(bytes) => (StatusCode::OK, bytes),
            Self::Failure(problem_details) => (problem_details.status.expect("Status code doesn't set"), &to_json_bytes(problem_details)),
        };

        let mut buffer = BufWriter::new(writer);

        buffer.write_all(status.as_str().as_bytes()).expect("Failed to write status");
        buffer.write_all(b"\n").expect("Failed to write newline");
        buffer.write_all(body).expect("Failed to write body");
    }
}

fn to_json_bytes<S: Serialize>(value: &S) -> Bytes {
    Bytes::from(serde_json::to_vec(value).expect("Failed to serialize to vec"))
}

#[cfg(test)]
mod tests;
