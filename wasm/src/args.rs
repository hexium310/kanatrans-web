use std::env::Args;

#[derive(Debug)]
pub enum KanatransArgs {
    Rpc(String),
    Rest(String),
    InvalidArgs,
}

#[derive(Debug, Default)]
struct RawArgs {
    rest: bool,
    rpc: bool,
    value: Option<String>,
}

impl From<Args> for KanatransArgs {
    fn from(args: Args) -> Self {
        // Skips executable path
        let mut args = args.skip(1);

        let mut raw_args = RawArgs::default();
        for arg in args.by_ref() {
            match arg.as_str() {
                "--rest" => raw_args.rest = true,
                "--rpc" => raw_args.rpc = true,
                value if raw_args.value.is_none() => raw_args.value = Some(value.to_string()),
                _ => (),
            }
        }

        match raw_args.value {
            Some(value) if raw_args.rest => Self::Rest(value),
            Some(value) if raw_args.rpc => Self::Rpc(value),
            Some(_) | None => Self::InvalidArgs,
        }
    }
}
