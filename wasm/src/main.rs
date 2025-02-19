use std::{env, io};

use adapter::processor::{conversion_table::ConversionTable, lex_lookup::LexLookup};
use router::Router;
use service::{arpabet::ArpabetService, katakana::KatakanaService, routing};

mod output;
mod router;

#[tokio::main(flavor = "current_thread")]
async fn main() {
    let uri = env::args().nth(1).unwrap_or_default();
    let arpabet_service = ArpabetService::<LexLookup>::default();
    let katakana_service = KatakanaService::<ConversionTable>::default();
    let router = Router::new(routing::router(arpabet_service, katakana_service));

    let output = router.apply(uri).await;

    output.write(&mut io::stdout().lock());
}
