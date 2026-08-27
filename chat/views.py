import os

from django.shortcuts import render

VITE_DEV_SERVER_URL = "{}://{}:{}".format(
    os.environ["VITE_DEV_SERVER_PROTOCOL"],
    os.environ["VITE_DEV_SERVER_HOST"],
    os.environ["VITE_DEV_SERVER_PORT"],
)

INITIAL_STATE = {
    "welcome": "Hi, how can I help you today?",
    "messages": [],
}


def chat(request):
    return render(
        request,
        "chat/chat.html",
        {
            "initial_state": INITIAL_STATE,
            "vite_dev_server_url": VITE_DEV_SERVER_URL,
        },
    )
