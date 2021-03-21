var aubio = require('./index.js');
var ref = require('ref-napi');

var get_features = function(path, params) {

	// create source
	var source = aubio.new_aubio_source(path, params.samplerate, params.hop_s);
	try {
		source.readPointer();
	}
	catch (e) {
		console.log('failed opening ' + path);
		return;
	}
	var samplerate = aubio.aubio_source_get_samplerate(source);
	console.log('samplerate: ' + samplerate);
	var total_frames = 0;
	var tmp_read = ref.alloc('int');

	// create tempo
	var tempo = aubio.new_aubio_tempo('default', params.win_s, params.hop_s, params.samplerate);
	var beats = [];
	var total_bpm = 0;

	// create pitch
	var pitch = aubio.new_aubio_pitch('default', params.win_s, params.hop_s, params.samplerate);
	aubio.aubio_pitch_set_unit(pitch, 'Hz')

	// create output for source
	var samples = aubio.new_fvec(params.hop_s);
	// create output for pitch and beat
	var out_fvec = aubio.new_fvec(1);

	while(true) {

		aubio.aubio_source_do(source, samples, tmp_read);

		aubio.aubio_pitch_do(pitch, samples, out_fvec);
		var cur_time = total_frames / samplerate;
		var last_pitch = aubio.fvec_get_sample(out_fvec, 0);
		//console.log('pitch at %d seconds: %d Hz', cur_time, last_pitch);

		aubio.aubio_tempo_do(tempo, samples, out_fvec);
		var is_beat = aubio.fvec_get_sample(out_fvec, 0);
		if (is_beat) {
			var last_beat = aubio.aubio_tempo_get_last_s(tempo);
			var last_bpm = aubio.aubio_tempo_get_bpm(tempo);
			beats.push(last_beat);
			console.log('beat at %d (%d bpm)', last_beat, last_bpm);
		}
		var read = tmp_read.deref();
		total_frames += read;
		if(read != params.hop_s) { break; }
	}
	var cur_time = total_frames / samplerate;
	console.log('total time : %d seconds (%d frames)', cur_time, total_frames);
	console.log('found %d beats total', beats.length);

	aubio.del_aubio_source(source);
	aubio.del_aubio_tempo(tempo);
	aubio.del_aubio_pitch(pitch);
}


if (process.argv[2]) {
	var filename = process.argv[2];
} else {
  console.log('error: a command line argument is required.');
  console.log('usage examples:');
  console.log('   ' + process.argv[0] + ' ' + process.argv[1] + ' <file.wav>');
  console.log('   ' + process.argv[0] + ' ' + process.argv[1] + ' <file.mp3>');
  return;
}

console.log('opening ' + filename);

get_features(filename, {
	samplerate: 44100,
	win_s : 1024,
	hop_s : 512,
});
