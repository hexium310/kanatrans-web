use service::{arpabet::Arpabet, katakana::Katakana};

pub(crate) trait ServiceResponse: erased_serde::Serialize {}

impl ServiceResponse for Arpabet {}

impl ServiceResponse for Katakana {}

erased_serde::serialize_trait_object!(ServiceResponse);
