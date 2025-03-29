import pytest
import requests as req
from time import sleep
import os
import json

domain = "https://api.wishify.ca"
email = "testAccount287232@wishify.ca"
password = "$eCur3Pa$$w0rD!1"

sleepTime = 0.8

##################  /events  #########################

def test_create_event(setup_test_account, log_in, cleanup_test_account, cleanup_test_event):
    token = log_in

    sleep(sleepTime)
    res = req.post(
        domain+f"/events/",
        headers={"Authorization": f"Bearer {token}"},
        json={"name":"Automated Test Event"}
    )

    event_id = res.json()["event"]["id"]
    cleanup_test_event(token, event_id)

    assert res.status_code == 201

def test_get_events(setup_test_account, setup_test_event, cleanup_test_account, cleanup_test_event):
    token, event_id = setup_test_event
    cleanup_test_event(token, event_id)

    sleep(sleepTime)
    res = req.get(
        domain+f"/events/",
        headers={"Authorization": f"Bearer {token}"},
        json={"name":"Automated Test Event"}
    )

    assert res.status_code == 200
    assert res.json()[0]["id"] == event_id

def test_get_event_by_id(setup_test_account, setup_test_event, cleanup_test_account, cleanup_test_event):
    token, event_id = setup_test_event
    cleanup_test_event(token, event_id)

    sleep(sleepTime)
    res = req.get(
        domain+f"/events/{event_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={"name":"Automated Test Event"}
    )

    assert res.status_code == 200
    assert res.json()["id"] == event_id


def test_put_event(setup_test_account, setup_test_event, cleanup_test_account, cleanup_test_event):
    token, event_id = setup_test_event
    cleanup_test_event(token, event_id)

    rename = "My renamed Event"

    sleep(sleepTime)
    res = req.put(
        domain+f"/events/{event_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={"name":rename}
    )

    assert res.status_code == 200
    assert res.json()["event"]["id"] == event_id
    assert res.json()["event"]["name"] == rename

    sleep(sleepTime)
    res = req.get(
        domain+f"/events/{event_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    print(res.json())
    assert res.json()["name"] == rename

def test_delete_event(setup_test_account, setup_test_event, cleanup_test_account):
    token, event_id = setup_test_event

    sleep(sleepTime)
    res = req.delete(
        domain+f"/events/{event_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200

    # check that the event no longer exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/events/{event_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404