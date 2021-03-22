var aubio = require('../');
var ref = require('ref-napi');

var filter_source = function(inputfile, outputfile, params) {

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
	var sink = aubio.new_aubio_sink(outputfile, samplerate);
    try {
        sink.readPointer();
    } catch (e) {
        console.error('failed opening ' + outputfile + ' for writing');
        return;
    }

    // create filter
    var filter = aubio.new_aubio_filter_a_weighting(samplerate);

    // start processing
	var total_frames = 0;
	var readPtr = ref.alloc('int');
	var samples = aubio.new_fvec(params.hop_s);
    while (true) {
		aubio.aubio_source_do(source, samples, readPtr);
		aubio.aubio_filter_do(filter, samples);
        aubio.aubio_sink_do(sink, samples, readPtr.deref());
        total_frames += readPtr.deref();
        if (readPtr.deref() != params.hop_s) { break; }
    }
	var cur_time = total_frames / samplerate;
	console.log('read %d seconds (%d frames) from %s', cur_time.toFixed(3),
            total_frames, inputfile);
	console.log('wrote filtered version to %s', outputfile);

    // clean up
    aubio.del_aubio_sink(sink);
    aubio.del_aubio_source(source);
    aubio.del_fvec(samples);
}

if (process.argv[2] && process.argv[3]) {
	var inputfile = process.argv[2];
	var outputfile = process.argv[3];
} else {
  console.error('command line arguments are required.');
  console.log('usage examples:');
  console.log('   ' + process.argv[0] + ' ' + process.argv[1] + ' <fileinput.wav> <fileoutput.wav');
  console.log('   ' + process.argv[0] + ' ' + process.argv[1] + ' <anotherfile.mp3> <fileoutput.wav>');
  return;
}

filter_source(inputfile, outputfile, {
	samplerate: 44100,
	hop_s : 512,
});
