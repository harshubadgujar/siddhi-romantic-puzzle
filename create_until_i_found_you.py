import math
import struct
import wave
import os

output_dir = r"C:\Users\badgu\.gemini\antigravity\scratch\siddhi-romantic-puzzle\public\audio"
os.makedirs(output_dir, exist_ok=True)
wav_file = os.path.join(output_dir, "until_i_found_you.wav")

sample_rate = 44100
duration_sec = 45  # 45 seconds loop
num_samples = sample_rate * duration_sec

notes_freq = {
    'G3': 196.00, 'B3': 246.94, 'C4': 261.63, 'D4': 293.66, 'Eb4': 311.13,
    'E4': 329.63, 'F#4': 369.99, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F#5': 739.99, 'G5': 783.99
}

# CHORUS MELODY - STARTS INSTANTLY AT SECOND 0.00!
# "I would never fall in love again until I found her... I said I would never fall unless it's you I fall into..."
melody = [
    ('G4', 0.8), ('B4', 0.4), ('D5', 1.2), ('E5', 0.8), ('D5', 0.8), ('B4', 0.8), ('G4', 1.2), ('A4', 1.2),
    ('F#4', 0.8), ('A4', 0.4), ('D5', 1.2), ('E5', 0.8), ('D5', 0.8), ('A4', 0.8), ('F#4', 1.2), ('G4', 1.2),
    ('G4', 0.8), ('B4', 0.4), ('D5', 1.2), ('E5', 0.8), ('D5', 0.8), ('B4', 0.8), ('G4', 1.2), ('C5', 1.2),
    ('B4', 0.8), ('A4', 0.8), ('G4', 2.0), ('G4', 1.5)
]

audio_data = []
tempo_bpm = 108
beat_sec = 60.0 / tempo_bpm

for i in range(num_samples):
    t = i / sample_rate
    
    # 60s Vintage Guitar Rhythm (G -> Bm -> C -> Cm)
    bar_time = (t / (beat_sec * 4)) % 4
    if bar_time < 1:
        chord = [196.00, 246.94, 293.66, 392.00]
    elif bar_time < 2:
        chord = [246.94, 369.99, 493.88, 587.33]
    elif bar_time < 3:
        chord = [261.63, 329.63, 392.00, 523.25]
    else:
        chord = [261.63, 311.13, 392.00, 523.25]

    strum_sample = 0.0
    for freq in chord:
        envelope = math.exp(-((t * 2.2) % 1.0) * 3.0)
        strum_sample += math.sin(2 * math.pi * freq * t) * envelope * 0.07

    # Lead Vocals starting IMMEDIATELY at 0.0s!
    melody_time = t % (len(melody) * beat_sec * 0.8)
    accum_sec = 0.0
    current_note = 'G4'
    for n_name, n_dur in melody:
        if accum_sec <= melody_time < accum_sec + n_dur * beat_sec * 0.8:
            current_note = n_name
            break
        accum_sec += n_dur * beat_sec * 0.8

    lead_freq = notes_freq.get(current_note, 392.00)
    note_progress = melody_time - (accum_sec - n_dur * beat_sec * 0.8)
    lead_env = math.exp(-note_progress * 1.2)
    
    # Warm vocal tone with harmonics
    lead_sample = (
        math.sin(2 * math.pi * lead_freq * t) * 0.7 +
        math.sin(2 * math.pi * lead_freq * 2 * t) * 0.25 +
        math.sin(2 * math.pi * lead_freq * 3 * t) * 0.1
    ) * lead_env * 0.22

    mix = strum_sample + lead_sample
    mix = max(-0.95, min(0.95, mix))

    val = int(mix * 32767)
    audio_data.append(struct.pack('<hh', val, val))

with wave.open(wav_file, 'w') as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(sample_rate)
    f.writeframes(b''.join(audio_data))

print(f"Generated chorus-first audio at: {wav_file}")
