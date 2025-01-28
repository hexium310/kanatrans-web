use std::{
    env,
    io::{stdout, BufWriter},
};

use adapter::processor::{conversion_table::ConversionTable, lex_lookup::LexLookup};
use error::ErrorKind;
use error_response::ErrorResponse;
use futures::{future, TryFutureExt};
use http::StatusCode;
use service::{
    arpabet::{ArpabetService, ArpabetServiceInterface},
    katakana::{KatakanaService, KatakanaServiceInterface},
};
use service_response::ServiceResponse;
use url::Url;

mod error;
mod error_response;
mod service_response;

#[tokio::main(flavor = "current_thread")]
async fn main() {
    let url = env::args()
        .next()
        .ok_or(ErrorKind::Http(StatusCode::BAD_REQUEST))
        .and_then(|v| Url::parse(&v).map_err(|e| ErrorKind::InternalError { source: e.into() }));

    let result = future::ready(url)
        .and_then(|url| async move { execute(url).await })
        .await;
    let output = match result {
        Ok(output) => output,
        Err(err) => Box::new(ErrorResponse { error: err.into() }),
    };

    let stdout = stdout();
    let buffer = BufWriter::new(stdout.lock());

    serde_json::to_writer(buffer, &output).unwrap();
}

async fn execute(url: Url) -> std::result::Result<Box<dyn ServiceResponse>, ErrorKind> {
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

            Ok(Box::new(arpabet))
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

            Ok(Box::new(katakana))
        },
        _ => Err(ErrorKind::Http(StatusCode::NOT_FOUND)),
    }
}
