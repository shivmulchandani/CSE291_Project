import requests
import json
import time
import asyncio

def make_get_request(word):
    url = f'https://wm8oa3cn3e.execute-api.us-west-2.amazonaws.com/items/{word}'
    response = requests.get(url)

    if response.status_code == 200:
        if response.text.strip():
            return json.loads(response.text).get('count')
        else:
            return 0
    else:
        return None


def make_post_request(words):
    # Replace 'https://api.example.com' with the actual API endpoint
    api_gateway_url = 'https://wm8oa3cn3e.execute-api.us-west-2.amazonaws.com/items'
    headers = {'Content-Type': 'application/json'}
    data = {'words': words}
    data_json = json.dumps(data)
    print(data_json)

    response = requests.put(api_gateway_url, data=data_json, headers=headers)

    print(response)
    print(response.text)


# Replace with the path to your text file
def main():
    file_path = '/Users/shivmulchandani/School/CSE 291/Project/the-full-bee-movie-script.txt'
    try:
        with open(file_path, 'r') as file:
            content = file.read()
            words = content.split()

            batch_size = 10
            batches = []
            current_batch = []

            start_time_all = time.time()
            for word in words:
                start_time = time.time()

                current_batch.append(word)

                if len(current_batch) == batch_size:
                    start_time = time.time()
                    #task = asyncio.create_task(make_post_request(current_batch))
                    make_post_request(current_batch)
                    batches.append(current_batch)
                    current_batch = []

                    end_time = time.time()
                    elapsed_time = end_time - start_time
                    print(f"Elapsed time: {elapsed_time} seconds")

            end_time_all = time.time()
            elapsed_time_all = end_time - start_time
            print(f"Elapsed time for job: {elapsed_time_all} seconds")

    except FileNotFoundError:
        print(f"File not found: {file_path}")
    except Exception as e:
        print(f"An error occurred: {e}")

main()
