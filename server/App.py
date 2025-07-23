from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi

app = Flask(__name__)
CORS(app)

@app.route('/api/search', methods=['POST'])
def search_transcript():
    data = request.get_json()
    video_id = data.get('videoId')
    keyword = data.get('keyword', '').strip().lower()
    language = data.get('language', 'en').strip().lower()

    print("📥 Received:", data)

    try:
        ytt_api = YouTubeTranscriptApi()

        # Language fallback options
        language_priority = {
            'en': ['en'],
            'hi': ['hi', 'a.en', 'a.hi'],
        }

        transcript = ytt_api.fetch(
            video_id,
            languages=language_priority.get(language, ['en'])
        )

        print("📜 Transcript fetched:", len(transcript), "lines")

        raw_data = transcript.to_raw_data()

        # Filter matches
        matches = [
            {
                'text': snippet['text'],
                'time': round(snippet['start']),
                'videoId': video_id,
                'link': f'https://www.youtube.com/watch?v={video_id}&t={int(snippet["start"])}s'
            }
            for snippet in raw_data
            if keyword in snippet['text'].lower()
        ]

        print("✅ Found matches:", len(matches))
        return jsonify({
            'matches': matches,
            'transcript': raw_data
        })

    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
