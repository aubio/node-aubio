var ffi = require('ffi-napi');
var ref = require('ref-napi');

var intPtr = ref.refType('int');
//var stringPtr = ref.refType(ref.types.CString);

var aubio = ffi.Library('libaubio', {
    // fvec
    "new_fvec": [ "pointer", [ "int" ]],
    "del_fvec": [ "void", [ "pointer" ]],
    "fvec_get_sample": [ "float", [ "pointer", "int" ]],
    "fvec_set_sample": [ "void", [ "pointer", "float", "int" ]],
    "fvec_get_data": [ "float", [ "pointer" ]],
    "fvec_print": [ "void", [ "pointer" ]],
    "fvec_set_all": [ "void", [ "pointer", "float" ]],
    "fvec_zeros": [ "void", [ "pointer" ]],
    "fvec_rev": [ "void", [ "pointer" ]],
    "fvec_weight": [ "void", [ "pointer", "pointer" ]],
    "fvec_copy": [ "void", [ "pointer", "pointer" ]],
    "fvec_ones": [ "void", [ "pointer" ]],

    // cvec
    "new_cvec": [ "pointer", [ "int" ]],
    "del_cvec": [ "void", [ "pointer" ]],
    "cvec_norm_get_sample": [ "float", [ "pointer", "int" ]],
    "cvec_norm_set_sample": [ "void", [ "pointer", "float", "int" ]],
    "cvec_norm_get_data": [ "float", [ "pointer" ]],
    "cvec_phas_get_data": [ "float", [ "pointer" ]],
    "cvec_print": [ "void", [ "pointer" ]],
    "cvec_copy": [ "void", [ "pointer", "pointer" ]],
    "cvec_norm_set_all": [ "void", [ "pointer", "float" ]],
    "cvec_norm_zeros": [ "void", [ "pointer" ]],
    "cvec_norm_ones": [ "void", [ "pointer" ]],
    "cvec_phas_set_all": [ "void", [ "pointer", "float" ]],
    "cvec_phas_zeros": [ "void", [ "pointer" ]],
    "cvec_phas_ones": [ "void", [ "pointer" ]],
    "cvec_zeros": [ "void", [ "pointer" ]],

    // source
    "new_aubio_source": [ "pointer", [ "string", "int", "int" ]],
    "aubio_source_do": [ "void", [ "pointer", "pointer", intPtr ]],
    "aubio_source_do_multi": [ "void", [ "pointer", "pointer", intPtr ]],
    "aubio_source_get_samplerate": [ "int", [ "pointer" ]],
    "aubio_source_get_channels": [ "int", [ "pointer" ]],
    "aubio_source_get_duration": [ "int", [ "pointer" ]],
    "aubio_source_seek": [ "int", [ "pointer", "int" ]],
    "aubio_source_close": [ "int", [ "pointer" ]],
    "del_aubio_source": [ "void", [ "pointer" ]],

    // sink
    "new_aubio_sink": [ "pointer", [ "string", "int" ]],
    "aubio_sink_preset_samplerate": [ "void", [ "pointer", "int" ]],
    "aubio_sink_preset_channels": [ "void", [ "pointer", "int" ]],
    "aubio_sink_get_samplerate": [ "int", [ "pointer" ]],
    "aubio_sink_get_channels": [ "int", [ "pointer" ]],
    "aubio_sink_do": ["void", ["pointer", "pointer", "int"]],
    "aubio_sink_do_multi": ["void", ["pointer", "pointer", "int"]],
    "aubio_sink_close": [ "int", [ "pointer" ]],
    "del_aubio_sink": [ "void", [ "pointer" ]],

    // filter
    "new_aubio_filter": [ "pointer", [ "int" ]],
    // new shortcuts
    "new_aubio_filter_a_weighting": [ "pointer", [ "int" ]],
    "new_aubio_filter_c_weighting": [ "pointer", [ "int" ]],
    // general do
    "aubio_filter_do": [ "void", [ "pointer", "pointer" ]],
    // variations
    "aubio_filter_do_outplace": [ "void", [ "pointer", "pointer", "pointer" ]],
    "aubio_filter_do_filtfilt": [ "void", [ "pointer", "pointer" ]],
    "aubio_filter_do_reset": [ "void", [ "pointer", "pointer" ]],
    "del_aubio_filter": [ "void", [ "pointer" ]],

    // phase vocoder
    "new_aubio_pvoc": [ "pointer", [ "int", "int" ]],
    "del_aubio_pvoc": [ "void", [ "pointer" ]],
    "aubio_pvoc_do": [ "void", [ "pointer", "pointer", "pointer" ]],
    "aubio_pvoc_rdo": [ "void", [ "pointer", "pointer", "pointer" ]],
    //"aubio_pvoc_get_win": [ "int", [ "pointer" ]],
    //"aubio_pvoc_get_hop": [ "int", [ "pointer" ]],

    // onset
    "new_aubio_onset": [ "pointer", [ "string", "int", "int", "int"]],
    "aubio_onset_do": [ "void", [ "pointer", "pointer", "pointer"]],
    "aubio_onset_get_last": [ "int", ["pointer"]],
    "aubio_onset_get_last_s": [ "float", ["pointer"]],
    "aubio_onset_get_last_ms": [ "float", ["pointer"]],
    "aubio_onset_set_silence": [ "int", ["pointer", "float"]],
    "aubio_onset_get_silence": [ "float", ["pointer"]],
    "aubio_onset_get_descriptor": [ "float", ["pointer"]],
    "aubio_onset_get_thresholded_descriptor": [ "float", ["pointer"]],
    "aubio_onset_set_threshold": [ "int", ["pointer", "float"]],
    "aubio_onset_set_minioi": [ "int", ["pointer", "int"]],
    "aubio_onset_set_minioi_s": [ "int", ["pointer", "int"]],
    "aubio_onset_set_minioi_ms": [ "int", ["pointer", "float"]],
    "aubio_onset_set_delay": [ "int", ["pointer", "int"]],
    "aubio_onset_set_delay_s": [ "int", ["pointer", "int"]],
    "aubio_onset_set_delay_ms": [ "int", ["pointer", "float"]],
    "aubio_onset_get_minioi": [ "int", ["pointer"]],
    "aubio_onset_get_minioi_s": [ "float", ["pointer"]],
    "aubio_onset_get_minioi_ms": [ "float", ["pointer"]],
    "aubio_onset_get_delay": [ "int", ["pointer"]],
    "aubio_onset_get_delay_s": [ "float", ["pointer"]],
    "aubio_onset_get_delay_ms": [ "float", ["pointer"]],
    "aubio_onset_get_threshold": [ "float", ["pointer"]],
    "del_aubio_onset": [ "void", ["pointer"]],

    // pitch
    "new_aubio_pitch": [ "pointer", [ "string", "int", "int", "int"]],
    "aubio_pitch_do": ["void", ["pointer", "pointer", "pointer"]],
    "aubio_pitch_set_tolerance": [ "int", ["pointer", "int"]],
    "aubio_pitch_set_unit": ["int", ["pointer", "string"]],
    "aubio_pitch_set_silence": ["int", ["pointer", "float"]],
    "aubio_pitch_get_silence": ["float", ["pointer"]],
    "aubio_pitch_get_confidence": ["float", ["pointer"]],
    "del_aubio_pitch": [ "void", ["pointer"]],

    // tempo
    "new_aubio_tempo": [ "pointer", [ "string", "int", "int", "int"]],
    "del_aubio_tempo": [ "void", ["pointer"]],
    "aubio_tempo_do": [ "void", [ "pointer", "pointer", "pointer"]],
    "aubio_tempo_get_last": [ "int", ["pointer"]],
    "aubio_tempo_get_last_s": [ "float", ["pointer"]],
    "aubio_tempo_get_last_ms": [ "float", ["pointer"]],
    "aubio_tempo_set_silence": [ "int", ["pointer", "float"]],
    "aubio_tempo_get_silence": [ "float", ["pointer"]],
    "aubio_tempo_set_threshold": [ "int", ["pointer", "float"]],
    "aubio_tempo_get_threshold": [ "float", ["pointer"]],
    "aubio_tempo_get_period": [ "float", ["pointer"]],
    "aubio_tempo_get_period_s": [ "float", ["pointer"]],
    "aubio_tempo_get_bpm": [ "float", ["pointer"]],
    "aubio_tempo_get_confidence": [ "float", ["pointer"]],

    // mfcc
    "new_aubio_mfcc": [ "pointer", [ "int", "int", "int", "int"]],
    "aubio_mfcc_do": ["void", ["pointer", "pointer", "pointer"]],
    "del_aubio_mfcc": [ "void", ["pointer"]],
});

module.exports = aubio;
