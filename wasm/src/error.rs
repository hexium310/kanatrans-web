use std::io::{BufWriter, Write};

use crate::output::Output;

pub struct ErrorOutput(pub String);

impl Output for ErrorOutput {
    fn write<W: Write>(&self, writer: &mut W) {
        let mut buffer = BufWriter::new(writer);

        buffer.write_all(self.0.as_bytes()).expect("Failed to write error message");
    }
}
