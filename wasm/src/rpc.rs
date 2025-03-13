use std::io::{BufWriter, Write};

use service::{arpabet::ArpabetServiceInterface, katakana::KatakanaServiceInterface};

use crate::output::Output;

#[derive(Debug)]
pub(crate) enum RpcOutput {
    Success(String),
    Failure,
}

pub struct RpcHandler<ArpabetService, KatakanaService> {
    arpabet_service: ArpabetService,
    katakana_service: KatakanaService,
}

impl Output for RpcOutput {
    fn write<W: Write>(&self, writer: &mut W) {
        let body = match self {
            Self::Success(pronunciation) => pronunciation.as_bytes(),
            Self::Failure => &[],
        };

        let mut buffer = BufWriter::new(writer);

        buffer.write_all(body).expect("Failed to write body");
    }
}

impl<ArpabetService, KatakanaService> RpcHandler<ArpabetService, KatakanaService>
where
    ArpabetService: ArpabetServiceInterface,
    KatakanaService: KatakanaServiceInterface,
{
    pub fn new(arpabet_service: ArpabetService, katakana_service: KatakanaService) -> Self {
        Self {
            arpabet_service,
            katakana_service
        }
    }

    pub async fn handle(&self, word: &str) -> RpcOutput {
        let arpabet = match self.arpabet_service.get(word.to_string()).await {
            Ok(arpabet) => arpabet,
            Err(_) => return RpcOutput::Failure,
        };

        let pronunciation = arpabet.pronunciation.iter().map(|v| v.as_str()).collect::<Vec<_>>();

        match self.katakana_service.get(&pronunciation).await {
            Ok(katakana) => RpcOutput::Success(katakana.pronunciation),
            Err(_) => RpcOutput::Failure,
        }
    }
}
