import pytest
import requests as req
from time import sleep
import os
import json

domain = "https://api.wishify.ca"

sleepTime = 0.8

##################  /items  #########################

def test_create_item(setup_test_account, setup_test_wishlist, cleanup_test_account, cleanup_test_wishlist, cleanup_test_item):
    token, wishlist_id = setup_test_wishlist
    
    sleep(sleepTime)
    res = req.post(
        domain+f"/items",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Automated Test Item - Create",
            "wishlists_id": wishlist_id,
            "quantity": 1,
            "url": "https://shop.mattel.com/en-ca/products/minecraft-steve-large-scale-action-figure-jgg67",
            "Description": "Will anyone ever see this?"
        }
    )

    item_id = res.json()["item"]["id"]
    cleanup_test_item(token, item_id)
    cleanup_test_wishlist(token, wishlist_id) # pass values for cleanup

    assert res.status_code == 201

def test_get_item_by_id(setup_test_account, setup_test_item_full, cleanup_test_account, cleanup_test_item_full):
    token, wishlist_id, item_id = setup_test_item_full

    sleep(sleepTime)
    res = req.get(
        domain+f"/items/{item_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    cleanup_test_item_full(token, wishlist_id, item_id)

    assert res.status_code == 200
    assert res.json()["id"] == item_id

def test_put_single_item(setup_test_account, setup_test_item_full, cleanup_test_account, cleanup_test_item_full):
    token, wishlist_id, item_id = setup_test_item_full

    updated_name = "Updated test item name"
    updated_description = "Updated test item description"

    sleep(sleepTime)
    res = req.put(
        domain+f"/items/{item_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": updated_name,
            "description": updated_description
        }
    )

    cleanup_test_item_full(token, wishlist_id, item_id)

    assert res.status_code == 201
    assert res.json()["item"]["id"] == item_id
    assert res.json()["item"]["name"] == updated_name
    assert res.json()["item"]["description"] == updated_description

def test_put_multi_item(setup_test_account, setup_test_item_full_multi, cleanup_test_account, cleanup_test_item_full_multi):
    token, wishlist_id, item_ids = setup_test_item_full_multi

    updated_items = []
    updated_name_prefix = "Updated Item: "

    # reverse the priority order and update names
    for i, item_id in enumerate(item_ids):
        updated_items.append(
            {
                "id": item_id,
                "name": updated_name_prefix+str(item_id),
                "priority": len(item_ids) - i,
            }
        )

    sleep(sleepTime)
    res = req.put(
        domain+f"/items",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "items": updated_items
        }
    )

    cleanup_test_item_full_multi(token, wishlist_id, item_ids)

    assert res.status_code == 201

    sleep(sleepTime)
    res = req.get(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200

    returned_items = res.json()["items"]

    # check priorites were reversed as expected
    for i, item in enumerate(returned_items):
        assert item_ids[-1*(i+1)] == item["id"]
        

    # check that names were updated
    for item in returned_items:
        assert item["name"] == updated_name_prefix+str(item["id"])

def test_delete_item(setup_test_account, setup_test_item_full, cleanup_test_account, cleanup_test_wishlist):
    token, wishlist_id, item_id = setup_test_item_full

    cleanup_test_wishlist(token, wishlist_id)   # pass in before any asserts

    sleep(sleepTime)
    res = req.delete(
        domain+f"/items/{item_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200

    # check that the item no longer exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/items/{item_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404

def test_delete_item_no_token(setup_test_account, setup_test_item_full, cleanup_test_account, cleanup_test_item_full):
    token, wishlist_id, item_id = setup_test_item_full

    cleanup_test_item_full(token, wishlist_id, item_id)   # pass in before any asserts

    sleep(sleepTime)
    res = req.delete(
        domain+f"/items/{item_id}",
        # headers={"Authorization": f"Bearer {token}"}, no token
    )

    assert res.status_code == 401

    # check that the item still exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/items/{item_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200

def test_delete_item_invalid_token(setup_test_account, setup_test_item_full, cleanup_test_account, cleanup_test_item_full):
    token, wishlist_id, item_id = setup_test_item_full

    cleanup_test_item_full(token, wishlist_id, item_id)   # pass in before any asserts

    sleep(sleepTime)
    res = req.delete(
        domain+f"/items/{item_id}",
        headers={"Authorization": f"Bearer 1678319someRandom419248Token142393"}, # invalid token
    )

    assert res.status_code == 401

    # check that the item still exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/items/{item_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200


