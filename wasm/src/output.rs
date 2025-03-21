use std::io::Write;

pub trait Output {
    fn write<W: Write>(&self, writer: &mut W);
}
