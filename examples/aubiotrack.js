const aubio = require('../')
const ref = require('ref-napi')

const buffer_size = 1024
const hop_size = 512; // number of samples to be read at each aubio_source_do call
const tempo_method = "default"
const onset_threshold = 0.0
const silence_threshold = -90.

let inputfile
if (process.argv[2]) {
  inputfile = process.argv[2]
} else {
  console.error('a command line is required.')
  console.log('usage examples:')
  console.log('   ' + process.argv[0] + ' ' + process.argv[1] + ' <mediafile>')
  return
}

const source = aubio.new_aubio_source(inputfile, 0, hop_size)
try {
  source.readPointer()
} catch (e) {
  console.error('failed opening ' + inputfile + ' for reading')
  return
}
const samplerate = aubio.aubio_source_get_samplerate(source); // 采样率

const tempo_out = aubio.new_fvec(2)
const tempo = aubio.new_aubio_tempo(tempo_method, buffer_size, hop_size, samplerate)
if (onset_threshold != 0.) aubio_tempo_set_threshold(tempo, onset_threshold)
const wavetable = aubio.new_aubio_wavetable(samplerate, hop_size)
aubio.aubio_wavetable_set_freq(wavetable, 2450.)
const input_buffer = aubio.new_fvec(hop_size)
const readPtr = ref.alloc('int')
let total_read = 0
let blocks = 0
do {
  aubio.aubio_source_do(source, input_buffer, readPtr)
  aubio.aubio_tempo_do(tempo, input_buffer, tempo_out)
  let is_beat = 0.
  let is_silence = 0
  is_beat = aubio.fvec_get_sample(tempo_out, 0)
  if (silence_threshold != -90.)
    is_silence = aubio.aubio_silence_detection(input_buffer, silence_threshold)
  if (is_beat && !is_silence) {
    aubio.aubio_wavetable_play(wavetable)
  } else {
    aubio.aubio_wavetable_stop(wavetable)
  }
  if (is_beat && !is_silence) {
    console.log(aubio.aubio_tempo_get_last(tempo) / samplerate)
  }
  blocks++
  total_read += readPtr.deref()
} while (readPtr.deref() == hop_size)

aubio.del_aubio_source(source)
aubio.del_fvec(input_buffer)
aubio.del_aubio_tempo(tempo)
aubio.del_aubio_wavetable(wavetable)
aubio.del_fvec(tempo_out)
