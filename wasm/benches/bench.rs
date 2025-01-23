use std::{fs::File, io::{BufWriter, IoSlice, Write}};

use criterion::{criterion_group, criterion_main, Criterion};
use http::StatusCode;
use service::arpabet::Arpabet;

fn json(a: &Arpabet, w: impl Write) {
    let json_string = serde_json::to_string(&a).unwrap();
    let mut buffer = BufWriter::new(w);

    writeln!(buffer, "{}", &json_string).unwrap();
}

fn json_to_writer(a: &Arpabet, w: impl Write) {
    let buffer = BufWriter::new(w);

    serde_json::to_writer(buffer, &a).unwrap();
}

fn plain(a: &Arpabet, w: impl Write) {
    let mut buffer = BufWriter::new(w);

    writeln!(buffer, "{}\n\n{}\n{}", StatusCode::OK.as_str(), a.word, a.pronunciation.join(" ")).unwrap();
}

fn plain_write_all(a: &Arpabet, w: impl Write) {
    let mut buffer = BufWriter::new(w);

    buffer.write_all(StatusCode::OK.as_str().as_bytes()).unwrap();
    buffer.write_all(b"\n\n").unwrap();
    buffer.write_all(a.word.as_bytes()).unwrap();
    buffer.write_all(b"\n").unwrap();
    buffer.write_all(a.pronunciation.join(" ").as_bytes()).unwrap();
    buffer.write_all(b"\n").unwrap();
}

fn plain_write_vectored(a: &Arpabet, w: impl Write) {
    let mut buffer = BufWriter::new(w);

    let _ = buffer.write_vectored(&[
        IoSlice::new(StatusCode::OK.as_str().as_bytes()),
        IoSlice::new(b"\n\n"),
        IoSlice::new(a.word.as_bytes()),
        IoSlice::new(b"\n"),
        IoSlice::new(a.pronunciation.join(" ").as_bytes()),
        IoSlice::new(b"\n"),
    ]).unwrap();
}

fn plain_write_all_append_newline(a: &Arpabet, w: impl Write) {
    let mut buffer = BufWriter::new(w);

    let status = StatusCode::OK.to_string() + "\n\n";
    let word = a.word.clone() + "\n";
    let pronunciation = a.pronunciation.join(" ") + "\n";

    buffer.write_all(status.as_bytes()).unwrap();
    buffer.write_all(word.as_bytes()).unwrap();
    buffer.write_all(pronunciation.as_bytes()).unwrap();
}

fn bench_json(c: &mut Criterion) {
    let arpabet = Arpabet {
        word: "bench".to_string(),
        pronunciation: vec!["b".to_string(), "eh1".to_string(), "n".to_string(), "ch".to_string()],
    };

    let f = File::open("/dev/null").unwrap();
    c.bench_function("json", |b| b.iter(|| json(&arpabet, f.try_clone().unwrap())));
}

fn bench_json_to_writer(c: &mut Criterion) {
    let arpabet = Arpabet {
        word: "bench".to_string(),
        pronunciation: vec!["b".to_string(), "eh1".to_string(), "n".to_string(), "ch".to_string()],
    };

    let f = File::open("/dev/null").unwrap();
    c.bench_function("json to_writer", |b| b.iter(|| json_to_writer(&arpabet, f.try_clone().unwrap())));
}

fn bench_plain(c: &mut Criterion) {
    let arpabet = Arpabet {
        word: "bench".to_string(),
        pronunciation: vec!["b".to_string(), "eh1".to_string(), "n".to_string(), "ch".to_string()],
    };

    let f = File::open("/dev/null").unwrap();
    c.bench_function("plain", |b| b.iter(|| plain(&arpabet, f.try_clone().unwrap())));
}

fn bench_plain_write_all(c: &mut Criterion) {
    let arpabet = Arpabet {
        word: "bench".to_string(),
        pronunciation: vec!["b".to_string(), "eh1".to_string(), "n".to_string(), "ch".to_string()],
    };

    let f = File::open("/dev/null").unwrap();
    c.bench_function("plain write_all", |b| b.iter(|| plain_write_all(&arpabet, f.try_clone().unwrap())));
}

fn bench_plain_write_vectored(c: &mut Criterion) {
    let arpabet = Arpabet {
        word: "bench".to_string(),
        pronunciation: vec!["b".to_string(), "eh1".to_string(), "n".to_string(), "ch".to_string()],
    };

    let f = File::open("/dev/null").unwrap();
    c.bench_function("plain write_vectored", |b| b.iter(|| plain_write_vectored(&arpabet, f.try_clone().unwrap())));
}

fn bench_plain_write_all_append_newline(c: &mut Criterion) {
    let arpabet = Arpabet {
        word: "bench".to_string(),
        pronunciation: vec!["b".to_string(), "eh1".to_string(), "n".to_string(), "ch".to_string()],
    };

    let f = File::open("/dev/null").unwrap();
    c.bench_function("plain write_all append newline", |b| b.iter(|| plain_write_all_append_newline(&arpabet, f.try_clone().unwrap())));
}

criterion_group!(benches, bench_json, bench_json_to_writer, bench_plain, bench_plain_write_all, bench_plain_write_vectored, bench_plain_write_all_append_newline);
criterion_main!(benches);
