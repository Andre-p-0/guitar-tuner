import numpy as np
import sounddevice as sd
import scipy.fftpack
import time

CONCERT_PITCH = 440
ALL_NOTES = ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"]

SAMPLING_FREQ = 44100 # sample frequency Hz or Samples per second
WINDOW_SIZE = 44100 # Size of window to use DFT on
WINDOW_STEP = 21050 # How many samples ahead is next frequency
WINDOW_LENGTH_S = WINDOW_SIZE / SAMPLING_FREQ # Window Length in seconds
SAMPLING_GAP = 1 / SAMPLING_FREQ # Length between two samples in seconds

# State
windowBuffer = [0 for _ in range(WINDOW_SIZE)] # Buffer to read samples into

def find_closest_note(pitch):
    i = int(np.round(np.log2(pitch/CONCERT_PITCH)*12))
    closest_note = ALL_NOTES[i%12] + str(4 + (i + 9) // 12)
    closest_pitch = CONCERT_PITCH*2**(i/12)
    return closest_note, closest_pitch


def callback(indata, frames, time, status):
    global windowBuffer
    if status:
        print(status)
    if any(indata):
        # indata[:, 0] extracts all samples from channel 0
        windowBuffer = np.concatenate((windowBuffer, indata[:, 0]))
        windowBuffer = windowBuffer[len(indata[:, 0]):]
        magnitudeSpec = abs(scipy.fftpack.fft(windowBuffer)[:len(windowBuffer)//2])

        # This blocks out the 8th string (E1 = 41.2Hz, F#1 = 46.25Hz)
        for i in range(int(62/SAMPLING_FREQ/WINDOW_SIZE)):
            magnitudeSpec[i] # Suppresses mains hum

        maxInd = np.argmax(magnitudeSpec) # Finds the maximum frequency in sample
        maxFreq = maxInd * (SAMPLING_FREQ/WINDOW_SIZE) # Why?
        closestNote, closestPitch = find_closest_note(maxFreq)

        up_opacity, down_opacity = calculate_opacities(maxFreq, closestPitch)

        print(f"Closest note: {closestNote} {maxFreq:.1f}/{closestPitch:.1f}")
        print(f"Up Opacity: {up_opacity}\nDown Oapcity: {down_opacity}\n\n")
    else:
        print('No input')

# Sets the opacity values for the tune up and down arrows
def calculate_opacities(freq, targetFreq):
    difference = targetFreq - freq
    tolerance = calculate_tuning_tolerance(targetFreq)
    print(f"tolerance = {tolerance}")
    print(f"difference = {difference}")
    if abs(difference) <= tolerance:
        return 0, 0
    else:
        max_difference = calculate_middle_of_semitone(difference, targetFreq)
        print(f"max_difference = {max_difference}")
        opacity = abs(difference/max_difference)
        print(opacity)
        if difference > 0:
            return opacity, 0
        else:
            return 0, opacity

# Calculates the exact middle between the upper and lower closest notes
def calculate_middle_of_semitone(difference, target_freq):
    frequency = target_freq
    # If difference is positive, the target frequency is higher
    # Meaning this needs to identify the next semitone below it
    if difference > 0:
        # To get to next semitone down you divide by 1.05946 (2**1/12)
        frequency = frequency / 1.05946
    semitone_distance = frequency * 0.05946
    return semitone_distance / 2

def calculate_tuning_tolerance(target_freq):
    # Calculates 10 cents above the target frequency
    # 1 cent = 1/100th of a semitone
    higher = target_freq * (2**(1/120))
    # Difference between the higher tolerated frequency and actual target frequency
    tolerance = higher - target_freq
    return tolerance

print("Starting Tuner :)")

try:
    with sd.InputStream(channels=1, callback=callback,
                        blocksize=WINDOW_STEP,
                        samplerate=SAMPLING_FREQ):
        while True:
            time.sleep(0.1)
except Exception as e:
    print(f"Tuner error: {e}")