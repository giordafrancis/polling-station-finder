// Polling station map — initialises Leaflet, draws district boundaries,
// and adds a "Reset view" control.
//
// Guard against double-initialisation if the page is swapped via HTMX.
(function () {
    if (window._pollingMapInit) return;
    window._pollingMapInit = true;

    const map = L.map('map').setView([51.45, -0.12], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    let districtsLayer;

    fetch('/districts.json')
        .then(r => r.json())
        .then(gj => {
            districtsLayer = L.geoJSON(gj, {
                style: { color: '#666', weight: 1, fillColor: '#fed7aa', fillOpacity: 0.60 }
            }).addTo(map);
            map.fitBounds(districtsLayer.getBounds());
        });

    // ── Reset-view control (top-right) ──
    const ResetControl = L.Control.extend({
        options: { position: 'topright' },
        onAdd: function (map) {
            const btn = L.DomUtil.create('button', 'leaflet-bar');
            btn.innerHTML = '⟲ Reset';
            btn.style.cssText = 'background:#fff;padding:6px 10px;cursor:pointer;font-size:14px;border:none;';
            btn.title = 'Reset view';
            L.DomEvent.disableClickPropagation(btn);
            btn.onclick = () => {
                if (districtsLayer) map.fitBounds(districtsLayer.getBounds());
                const input = document.querySelector('input[name=q]');
                if (input) input.value = '';
                const results = document.getElementById('results');
                if (results) results.innerHTML = '';
            };
            return btn;
        }
    });
    new ResetControl().addTo(map);
})();
