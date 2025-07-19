#!/usr/bin/env python3
"""
Google Indexing API Script for Bulk URL Submission
Created for iAN - Inteligencia Artificial para Negocios
"""

from google.oauth2 import service_account
import requests
import json
import time
import sys
from pathlib import Path

# Configuration
JSON_KEY_FILE = "/Users/patricio/keys/indexing-sa.json"
SCOPES = ["https://www.googleapis.com/auth/indexing"]
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"

def get_credentials():
    """Load and return service account credentials"""
    try:
        credentials = service_account.Credentials.from_service_account_file(
            JSON_KEY_FILE, scopes=SCOPES
        )
        return credentials
    except Exception as e:
        print(f"Error loading credentials: {e}")
        sys.exit(1)

def submit_url_for_indexing(url, credentials):
    """Submit a single URL to Google Indexing API"""
    try:
        # Get access token
        import google.auth.transport.requests
        auth_req = google.auth.transport.requests.Request()
        credentials.refresh(auth_req)
        access_token = credentials.token
        
        # Prepare request
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'url': url.strip(),
            'type': 'URL_UPDATED'
        }
        
        # Make request
        response = requests.post(ENDPOINT, headers=headers, json=data)
        result = response.json()
        
        if response.status_code == 200:
            print(f"✅ SUCCESS: {url}")
            if 'urlNotificationMetadata' in result and 'latestUpdate' in result['urlNotificationMetadata']:
                print(f"   Notification Time: {result['urlNotificationMetadata']['latestUpdate']['notifyTime']}")
            return True
        else:
            print(f"❌ ERROR: {url}")
            if 'error' in result:
                print(f"   Code: {result['error']['code']}")
                print(f"   Message: {result['error']['message']}")
            return False
            
    except Exception as e:
        print(f"❌ EXCEPTION: {url} - {e}")
        return False

def submit_urls_from_list(urls, credentials):
    """Submit multiple URLs with rate limiting"""
    success_count = 0
    total_urls = len(urls)
    
    print(f"\n🚀 Starting submission of {total_urls} URLs...")
    print("=" * 60)
    
    for i, url in enumerate(urls, 1):
        print(f"\n[{i}/{total_urls}] Processing: {url}")
        
        if submit_url_for_indexing(url, credentials):
            success_count += 1
        
        # Rate limiting: wait 1 second between requests
        if i < total_urls:
            time.sleep(1)
    
    print("\n" + "=" * 60)
    print(f"📊 SUMMARY:")
    print(f"   Total URLs: {total_urls}")
    print(f"   Successful: {success_count}")
    print(f"   Failed: {total_urls - success_count}")
    print(f"   Success Rate: {(success_count/total_urls*100):.1f}%")

def main():
    """Main function"""
    print("🔍 Google Indexing API - Bulk URL Submitter")
    print("📋 iAN - Inteligencia Artificial para Negocios")
    print("-" * 60)
    
    # Load credentials
    print("🔑 Loading credentials...")
    credentials = get_credentials()
    print("✅ Credentials loaded successfully")
    
    # Define URLs to submit
    urls_to_submit = [
        "https://inteligenciaartificialparanegocios.com/facebook-ads-ia-guia-completa-mexico-2025.html",
        # Add more URLs here as needed
    ]
    
    # Submit URLs
    submit_urls_from_list(urls_to_submit, credentials)
    
    print("\n🎉 Script completed!")

if __name__ == "__main__":
    main()