# Test Fixtures

This directory contains test files used for E2E testing.

## Files

### sample-audio.mp3
A small audio file (< 1MB) used for testing artifact upload and transcription.
You can create this file using:

```bash
# Generate a 5-second silent audio file
ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 5 -acodec libmp3lame -ab 64k sample-audio.mp3
```

Or use any small audio file (MP3, WAV, M4A) for testing.

### sample-video.mp4
A small video file used for testing video artifact upload.

### sample-image.jpg
A test image file for testing image artifact upload.

## Usage

These files are referenced in the E2E tests for uploading artifacts and testing the full pipeline.

**Important:** Keep fixture files small (< 5MB) to ensure fast test execution.
