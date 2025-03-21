use std::{env, io};

use adapter::processor::{conversion_table::ConversionTable, lex_lookup::LexLookup};
use args::KanatransArgs;
use error::ErrorOutput;
use output::Output;
use router::Router;
use rpc::RpcHandler;
use service::{arpabet::ArpabetService, katakana::KatakanaService, routing};

mod args;
mod error;
mod output;
mod rest;
mod router;
mod rpc;

#[tokio::main(flavor = "current_thread")]
async fn main() {
    let arpabet_service = ArpabetService::<LexLookup>::default();
    let katakana_service = KatakanaService::<ConversionTable>::default();

    match KanatransArgs::from(env::args()) {
        KanatransArgs::Rpc(word) => {
            let rpc_handler = RpcHandler::new(arpabet_service, katakana_service);
            let output = rpc_handler.handle(&word).await;

            output.write(&mut io::stdout().lock());
        },
        KanatransArgs::Rest(uri) => {
            let router = Router::new(routing::router(arpabet_service, katakana_service));
            let output = router.apply(uri).await;

            output.write(&mut io::stdout().lock());
        },
        KanatransArgs::InvalidArgs => {
            let output = ErrorOutput("Invalid arguments. --rest [URI] or --rpc [WORD]\n".to_string());

            output.write(&mut io::stderr().lock());
        },
    }
}
