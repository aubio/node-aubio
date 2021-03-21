var aubio = require('../');
var ref = require('ref-napi');

if (process.argv[2]) {
    var inputfile = process.argv[2];
} else {
    console.error('a command line is required.');
    console.log('usage examples:');
    console.log('   ' + process.argv[0] + ' ' + process.argv[1] + ' <mediafile>');
    return;
}

var samplerate = 0; // this tells aubio_source to use test.wav samplerate
var hop_s = 512; // number of samples to be read at each aubio_source_do call

var source = aubio.new_aubio_source(inputfile, samplerate, hop_s);
try {
  source.readPointer();
} catch (e) {
  console.error('failed opening ' + inputfile + ' for reading');
  return;
}
// get the actual samplerate of the input file
var samplerate = aubio.aubio_source_get_samplerate(source);

var readPtr = ref.alloc('int'); // a pointer to and int
var total_frames = 0; // frame counter

var samples = aubio.new_fvec(hop_s);
while (true) {
  // read at most hop_s frames from inputfile
  aubio.aubio_source_do(source, samples, readPtr);
  // increment the number of frames read
  total_frames += readPtr.deref();
  // stop at end of file
  if (readPtr.deref() != hop_s) { break; }
}
// compute the duration in seconds
var cur_time = total_frames / samplerate;
// print duration and number of frames read
console.log('read %d seconds (%d frames) from %s', cur_time.toFixed(3),
    total_frames, inputfile);

// clean up memory (each new_ should have a corresponding del_)
aubio.del_aubio_source(source);
aubio.del_fvec(samples);
