// ==UserScript==
// @name         Pennylane Display & Copy Current ID (Client / Invoice)
// @downloadURL
// @updateURL
// @namespace    http://yourdomain.com/
// @version      1.0
// @description  Show current Client ID or Invoice ID with a copy button in Pennylane.
// @match        https://app.pennylane.com/companies/*/clients/customer_invoices*
// @match        https://app.pennylane.com/companies/*/thirdparties/customers*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);
    const path = url.pathname;
    const params = url.searchParams;

    let label = null;
    let currentId = null;

    // Detect context & ID
    if (path.includes('/clients/customer_invoices')) {
        // Invoice list page
        currentId = params.get('invoice_id');
        label = 'Invoice ID';
    } else if (path.includes('/thirdparties/customers')) {
        // Customer page
        currentId = params.get('id');
        label = 'Client ID';
    }

    // If we don't find an ID, do nothing
    if (!currentId || !label) {
        return;
    }

    // Create cyan box container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '210px'; // above the red box at 30px
    container.style.right = '30px';
    container.style.padding = '30px';
    container.style.backgroundColor = '#00FFFF';  // cyan
    container.style.border = '5px solid #008B8B'; // darker cyan border
    container.style.zIndex = '10000';
    container.style.width = '380px';
    container.style.fontFamily = 'sans-serif';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'space-between';
    container.style.boxSizing = 'border-box';

    // Text: "Invoice ID: xxx" or "Client ID: xxx"
    const textSpan = document.createElement('span');
    textSpan.textContent = `${label}: ${currentId}`;
    textSpan.style.fontSize = '20px';
    textSpan.style.marginRight = '8px';
    textSpan.style.wordBreak = 'break-all';

    // Copy button
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.style.fontSize = '20px';
    copyButton.style.height = '50px';
    copyButton.style.width = '90px';
    copyButton.style.flexShrink = '0';

    copyButton.onclick = async () => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(currentId);
            } else {
                // Fallback: temporary input
                const tempInput = document.createElement('input');
                tempInput.value = currentId;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
            }
            copyButton.textContent = 'Copied!';
            setTimeout(() => { copyButton.textContent = 'Copy'; }, 1000);
        } catch (e) {
            alert('Could not copy ID to clipboard');
        }
    };

    container.appendChild(textSpan);
    container.appendChild(copyButton);
    document.body.appendChild(container);

})();
