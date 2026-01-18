import boto3
import json

# Create Bedrock client
bedrock = boto3.client(
    service_name='bedrock-runtime',
    region_name='us-west-2'
)

# Prepare request
request_body = {
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 100,
    "messages": [
        {
            "role": "user",
            "content": "What is 2+2? Answer in one sentence."
        }
    ]
}

# Make API call
response = bedrock.invoke_model(
    modelId='anthropic.claude-3-sonnet-20240229-v1:0',
    body=json.dumps(request_body)
)

# Parse response
response_body = json.loads(response['body'].read())
print(response_body['content'][0]['text'])