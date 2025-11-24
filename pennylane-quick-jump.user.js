// ==UserScript==
// @name         Pennylane Quick Invoice & Client Jump
// @downloadURL  https://raw.githubusercontent.com/RaphRsl/tampermonkey/main/pennylane-copy-id.user.js
// @updateURL    https://raw.githubusercontent.com/RaphRsl/tampermonkey/main/pennylane-copy-id.user.js
// @namespace    https://github.com/RaphRsl/tampermonkey
// @version      0.6
// @description  Jump directly to a client ID or invoice ID in Pennylane.
// @match        https://app.pennylane.com/companies/*/clients/customer_invoices*
// @match        https://app.pennylane.com/companies/*/thirdparties/customers*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create UI container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '30px';
    container.style.right = '30px';
    container.style.padding = '25px';
    container.style.backgroundColor = '#FF0000';
    container.style.border = '5px solid #8B0000';
    container.style.zIndex = '9999';
    container.style.width = '380px';

    //
    // --- CLIENT BOX (TOP) ---
    //
    const clientRow = document.createElement('div');
    clientRow.style.display = 'flex';
    clientRow.style.alignItems = 'center';
    clientRow.style.width = '100%';
    clientRow.style.marginBottom = '5px';

    const clientInput = document.createElement('input');
    clientInput.type = 'text';
    clientInput.placeholder = 'Client ID';
    clientInput.style.width = '220px';
    clientInput.style.height = '30px';
    clientInput.style.fontSize = '20px';
    clientInput.style.marginRight = '5px';
    clientInput.style.marginBottom = '5px';

    const clientButton = document.createElement('button');
    clientButton.innerText = 'Go';
    clientButton.style.height = '50px';
    clientButton.style.width = '70px';
    clientButton.style.fontSize = '20px';
    clientButton.style.marginLeft = 'auto';

    clientButton.onclick = () => {
        const id = clientInput.value.trim();
        if (!id) {
            alert('Please enter a client ID');
            return;
        }

        const currentUrl = new URL(window.location.href);
        const match = currentUrl.pathname.match(/\/companies\/(\d+)\//);
        if (!match) {
            alert('Could not detect company ID from URL');
            return;
        }

        const companyId = match[1];
        const clientUrl = `https://app.pennylane.com/companies/${companyId}/thirdparties/customers?id=${id}`;
        window.location.href = clientUrl;
    };

    clientInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') clientButton.click();
    });

    clientRow.appendChild(clientInput);
    clientRow.appendChild(clientButton);
    container.appendChild(clientRow);


    const spacer = document.createElement('div');
    spacer.style.height = '8px';
    container.appendChild(spacer);

    //
    // --- INVOICE BOX (BOTTOM) ---
    //

    const invoiceRow = document.createElement('div');
    invoiceRow.style.display = 'flex';
    invoiceRow.style.alignItems = 'center';
    invoiceRow.style.width = '100%';

    const invoiceInput = document.createElement('input');
    invoiceInput.type = 'text';
    invoiceInput.placeholder = 'Invoice ID';
    invoiceInput.style.width = '220px';
    invoiceInput.style.height = '30px';
    invoiceInput.style.fontSize = '20px';
    invoiceInput.style.marginRight = '5px';

    const invoiceButton = document.createElement('button');
    invoiceButton.innerText = 'Go';
    invoiceButton.style.height = '50px';
    invoiceButton.style.width = '70px';
    invoiceButton.style.fontSize = '20px';
    invoiceButton.style.marginLeft = 'auto';

    invoiceButton.onclick = () => {
        const id = invoiceInput.value.trim();
        if (!id) {
            alert('Please enter an invoice ID');
            return;
        }

        // Always redirect to the invoice page, regardless of current page
        const currentUrl = new URL(window.location.href);
        const match = currentUrl.pathname.match(/\/companies\/(\d+)\//);
        if (!match) {
            alert('Could not detect company ID from URL');
            return;
        }

        const companyId = match[1];

        // This mimics your original logic but forces the right path:
        // /companies/{companyId}/clients/customer_invoices?invoice_id=xxx&page=1
        const invoiceUrl = new URL(
            `https://app.pennylane.com/companies/${companyId}/clients/customer_invoices`,
            window.location.origin
        );
        invoiceUrl.searchParams.set('invoice_id', id);
        invoiceUrl.searchParams.set('page', '1');

        window.location.href = invoiceUrl.toString();
    };

    invoiceInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') invoiceButton.click();
    });

    invoiceRow.appendChild(invoiceInput);
    invoiceRow.appendChild(invoiceButton);
    container.appendChild(invoiceRow);

    // Add container to page
    document.body.appendChild(container);

})();
