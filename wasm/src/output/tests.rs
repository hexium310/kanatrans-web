use http::StatusCode;
use problem_details::ProblemDetails;

use crate::output::Output;

#[test]
fn write_success_output() {
    let output = Output::Success("{\"word\":\"word\",\"pronunciation\":[\"w\", \"er1\", \"d\"]}".into());
    let mut writer = Vec::<u8>::new();

    output.write(&mut writer);

    assert_eq!(writer, b"200\n{\"word\":\"word\",\"pronunciation\":[\"w\", \"er1\", \"d\"]}");
}

#[test]
fn write_failure_output() {
    let output = Output::Failure(ProblemDetails::from_status_code(StatusCode::IM_A_TEAPOT));
    let mut writer = Vec::<u8>::new();

    output.write(&mut writer);

    assert_eq!(writer, b"418\n{\"status\":418,\"title\":\"I'm a teapot\"}");
}
