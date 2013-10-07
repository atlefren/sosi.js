var leafletUtils = window.leafletUtils || {};
(function (ns) {
    leafletUtils.SkTiles = function (options) {
        /**
         Tiles from Statkart. Available layers are:
         - matrikkel_bakgrunn
         - topo2
         - topo2graatone
         - europa
         - toporaster2
         - sjo_hovedkart2
         - kartdata2
         - norges_grunnkart
         - norges_grunnkart_graatone

         See http://statkart.no/Kart/Kartverksted/Visningstjenester/
         **/
        return L.tileLayer(
            'http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=' + options.layers + '&zoom={z}&x={x}&y={y}',
            {
                attribution: "&copy; <a href='http://statkart.no'>Kartverket</a>"
            }
        );

    };
}(leafletUtils));