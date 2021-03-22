var aubio = require('../');
var ref = require('ref-napi');

var extract_mfcc = function(inputfile, params) {

    // open input file for reading
    var source = aubio.new_aubio_source(inputfile, params.samplerate, params.hop_s);
    try {
        source.readPointer();
    } catch (e) {
        console.error('failed opening ' + inputfile + ' for reading');
        return;
    }

    // get the real samplerate of the input file in case 0 was passed as params.samplerate
    var samplerate = aubio.aubio_source_get_samplerate(source);

    // open output file for writing
    var pvoc = aubio.new_aubio_pvoc(params.win_s, params.hop_s);
    try {
        pvoc.readPointer();
    } catch (e) {
        console.error('failed creating phase vocoder');
        return; //goto failed_pvoc;
    }

    // create filter
    var mfcc = aubio.new_aubio_mfcc(params.win_s, params.n_filters,
            params.n_coeffs, samplerate);
    try {
        mfcc.readPointer();
    } catch (e) {
        console.error('failed creating phase vocoder');
        return; //goto failed_pvoc;
    }

    // start processing
    var total_frames = 0;
    var readPtr = ref.alloc('int');
    var samples = aubio.new_fvec(params.hop_s);
    var fftgrain = aubio.new_cvec(params.win_s);
    var mfcc_out = aubio.new_fvec(params.n_coeffs);
    while (true) {
        aubio.aubio_source_do(source, samples, readPtr);
        aubio.aubio_pvoc_do(pvoc, samples, fftgrain);
        aubio.aubio_mfcc_do(mfcc, fftgrain, mfcc_out);
        aubio.fvec_print(mfcc_out);
        total_frames += readPtr.deref();
        if (readPtr.deref() != params.hop_s) { break; }
    }
    var cur_time = total_frames / samplerate;
    console.log('read %d seconds (%d samples) from %s', cur_time.toFixed(3),
            total_frames, inputfile);

    // clean up
    aubio.del_aubio_mfcc(mfcc);
    aubio.del_aubio_pvoc(pvoc);
    aubio.del_aubio_source(source);
    aubio.del_fvec(samples);
    aubio.del_cvec(fftgrain);
    aubio.del_fvec(mfcc_out);
}

if (process.argv[2]) {
    var inputfile = process.argv[2];
} else {
    console.error('a command line is required.');
    console.log('usage examples:');
    console.log('   ' + process.argv[0] + ' ' + process.argv[1] + ' <mediafile>');
    return;
}

extract_mfcc(inputfile, {
    samplerate: 0, // will use input source samplerate
    win_s : 512,
    hop_s : 256,
    n_filters: 40,
    n_coeffs: 13,
});
