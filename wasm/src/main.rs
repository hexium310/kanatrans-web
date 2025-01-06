use std::{
    env,
    io::{stderr, stdout, BufWriter, Write},
};

use adapter::processor::{conversion_table::ConversionTable, lex_lookup::LexLookup};
use error::ErrorKind;
use futures::{future, TryFutureExt};
use http::StatusCode;
use serde::Serialize;
use service::{
    arpabet::{ArpabetService, ArpabetServiceInterface},
    katakana::{KatakanaService, KatakanaServiceInterface},
};
use url::Url;

mod error;

#[derive(Debug, Serialize)]
struct ErrorResponse {
    error: ErrorResponseBody,
}

#[derive(Debug, Serialize)]
struct ErrorResponseBody {
    status: u16,
    message: String,
}

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

#[tokio::main(flavor = "current_thread")]
async fn main() {
    let url = env::args()
        .next()
        .ok_or(ErrorKind::Http(StatusCode::BAD_REQUEST))
        .and_then(|v| Url::parse(&v).map_err(|e| ErrorKind::InternalError { source: e.into() }));

    let result = future::ready(url)
        .and_then(|url| async move { execute(url).await })
        .await;
    match result {
        Ok(output) => {
            let stdout = stdout();
            let mut buffer = BufWriter::new(stdout.lock());

            writeln!(buffer, "{}", &output).unwrap();
        },
        Err(err) => {
            let stderr = stderr();
            let mut buffer = BufWriter::new(stderr.lock());

            let error_resposne = ErrorResponse { error: err.into() };
            let error_resposne = serde_json::to_string(&error_resposne).unwrap();

            writeln!(buffer, "{}", &error_resposne).unwrap();
        },
    }
}

async fn execute(url: Url) -> std::result::Result<String, ErrorKind> {
    let mut path_segments = url.path_segments().ok_or(ErrorKind::Http(StatusCode::NOT_FOUND))?;

    match path_segments.next() {
        Some("arpabet") => {
            let word = path_segments.next().ok_or(ErrorKind::Http(StatusCode::NOT_FOUND))?;

            if path_segments.next().is_some() {
                return Err(ErrorKind::Http(StatusCode::NOT_FOUND));
            }

            let arpabet_service = ArpabetService::<LexLookup>::default();
            let arpabet = arpabet_service
                .get(word.to_owned())
                .await
                .map_err(|e| ErrorKind::InternalError { source: e.into() })?;

            serde_json::to_string(&arpabet).map_err(|e| ErrorKind::InternalError { source: e.into() })
        },
        Some("katakana") => {
            let (_, pronunciation) = url
                .query_pairs()
                .find(|(key, _)| key == "pronunciation")
                .ok_or(ErrorKind::Http(StatusCode::BAD_REQUEST))?;
            let katakana_service = KatakanaService::<ConversionTable>::default();
            let arpabet = pronunciation.split(" ").collect::<Vec<_>>();
            let katakana = katakana_service
                .get(&arpabet)
                .await
                .map_err(|e| ErrorKind::InternalError { source: e.into() })?;

            serde_json::to_string(&katakana).map_err(|e| ErrorKind::InternalError { source: e.into() })
        },
        _ => Err(ErrorKind::Http(StatusCode::NOT_FOUND)),
    }
}
