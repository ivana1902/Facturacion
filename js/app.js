document.addEventListener('DOMContentLoaded', function () {
    const invoiceNumberElement = document.getElementById('invoice-number');
    const invoiceDateInput = document.getElementById('invoice-date');
    const clientNameInput = document.getElementById('client-name');
    const clientIdInput = document.getElementById('client-id');
    const productsBody = document.getElementById('products-body');
    const addProductBtn = document.getElementById('add-product');
    const printInvoiceBtn = document.getElementById('print-invoice');
    const subtotalTotal = document.getElementById('subtotal-total');
    const taxTotal = document.getElementById('tax-total');
    const grandTotal = document.getElementById('grand-total');
    const invoiceForm = document.getElementById('invoice-form');

    const TAX_RATE = 0.10;

    function generarNumeroFactura() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const randomCode = Math.floor(Math.random() * 9000 + 1000);
        return `INV-${year}${month}${day}-${randomCode}`;
    }

    function formatCurrency(value) {
        return `Gs ${value.toFixed(2)}`;
    }

    function calcularTotales() {
        const rows = document.querySelectorAll('.product-row');
        let subtotalGeneral = 0;

        rows.forEach(function (row) {
            const cantidadInput = row.querySelector('.product-quantity');
            const precioInput = row.querySelector('.product-price');
            const subtotalElement = row.querySelector('.product-subtotal');

            const cantidad = parseFloat(cantidadInput.value) || 0;
            const precio = parseFloat(precioInput.value) || 0;
            const subtotal = cantidad * precio;

            subtotalElement.textContent = formatCurrency(subtotal);
            subtotalGeneral += subtotal;
        });

        const iva = subtotalGeneral * TAX_RATE;
        const totalFinal = subtotalGeneral + iva;

        subtotalTotal.textContent = formatCurrency(subtotalGeneral);
        taxTotal.textContent = formatCurrency(iva);
        grandTotal.textContent = formatCurrency(totalFinal);
    }

    function agregarFila() {
        const row = document.createElement('tr');
        row.className = 'product-row';
        row.innerHTML = `
            <td><input type="text" class="product-description" required placeholder="Descripción del producto"></td>
            <td><input type="number" class="product-quantity" min="1" value="1" required></td>
            <td><input type="number" class="product-price" min="0" step="0.01" value="0.00" required></td>
            <td><span class="product-subtotal">Gs 0.00</span></td>
            <td><button type="button" class="btn btn-danger btn-remove">Eliminar</button></td>
        `;
        productsBody.appendChild(row);
        agregarEventosFila(row);
        calcularTotales();
    }

    function eliminarFila(event) {
        const button = event.target;
        const row = button.closest('.product-row');
        if (row) {
            row.remove();
            calcularTotales();
        }
    }

    function agregarEventosFila(row) {
        const cantidadInput = row.querySelector('.product-quantity');
        const precioInput = row.querySelector('.product-price');
        const removeButton = row.querySelector('.btn-remove');

        cantidadInput.addEventListener('input', calcularTotales);
        precioInput.addEventListener('input', calcularTotales);
        removeButton.addEventListener('click', eliminarFila);
    }

    function inicializarFilas() {
        const rows = document.querySelectorAll('.product-row');
        rows.forEach(function (row) {
            agregarEventosFila(row);
        });
    }

    addProductBtn.addEventListener('click', agregarFila);

    printInvoiceBtn.addEventListener('click', function () {
        if (!invoiceForm.checkValidity()) {
            invoiceForm.reportValidity();
            return;
        }
        window.print();
    });

    invoiceForm.addEventListener('input', function (event) {
        const target = event.target;
        if (target.matches('.product-quantity') || target.matches('.product-price')) {
            calcularTotales();
        }
    });

    invoiceNumberElement.textContent = generarNumeroFactura();
    invoiceDateInput.valueAsDate = new Date();

    inicializarFilas();
    calcularTotales();
});