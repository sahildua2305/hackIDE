from celery import shared_task

import requests

@shared_task
def async_json_post_request(URL, data):
    r = requests.post(URL, data=data)
    return r.json()
