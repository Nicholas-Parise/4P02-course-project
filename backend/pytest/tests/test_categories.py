import pytest
import requests as req
from time import sleep
import os
import json

domain = "https://api.wishify.ca"
email = "testAccount287232@wishify.ca"
password = "$eCur3Pa$$w0rD!1"

sleepTime = 0.8

##################  /categories  #########################

# test get all categories (200)
def test_get_categories(setup_test_account, log_in, cleanup_test_account):
    token = log_in

    sleep(sleepTime)
    res = req.get(
        domain+"/categories",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 200
    assert len(res.json()) > 0
    assert res.json()[0]["name"] == "Books"
    assert res.json()[0]["id"] == 1


# test get category by id (200)
def test_get_category_by_id(setup_test_account, log_in, cleanup_test_account):
    token = log_in

    sleep(sleepTime)
    res = req.get(
        domain+"/categories/1",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 200
    assert res.json()["name"] == "Books"
    assert res.json()["id"] == 1

# test get category by id not found (404)
def test_get_category_by_id_not_found(setup_test_account, log_in, cleanup_test_account):
    token = log_in

    sleep(sleepTime)
    res = req.get(
        domain+"/categories/999999",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 404

# test create duplicate category (409)
def test_create_duplicate_category(setup_test_account, log_in, cleanup_test_account):
    token = log_in

    sleep(sleepTime)
    res = req.post(
        domain+"/categories",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Books",
            "description": "The more you know.",
            "password": "abc123"
        }
    )
    assert res.status_code == 409