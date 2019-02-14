<template>
  <div id="app">
    <button type="button" @click="loadStation">加载基站</button>
    <button type="button" @click="loadCell">加载小区</button>
    <button type="button" @click="loadStationAndCell">加载基站和小区</button>
    <baidu-map
      class="map"
      :center="initCenter"
      :scroll-wheel-zoom="true"
      :zoom="10"
      @click="handleMapClick"
    >
      <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
      <bm-marker
        v-for="(marker, index) in markers"
        :key="index"
        :position="{ lng: marker.lng, lat: marker.lat }"
        :rotation="getRotation(marker.azimuth)"
        :icon="getIcon(marker.type, marker.isCenter)"
        :zIndex="zIndex"
        :offset="getOffsetData(marker.azimuth)"
        @click="showInfoWindow(marker);"
      >
      </bm-marker>
      <bm-info-window
        :show="infoWindow.show"
        :position="{ lng: infoWindow.data.lng, lat: infoWindow.data.lat }"
        :offset="getOffsetData(infoWindow.data.azimuth)"
        @close="closeWindow"
        @open="openWindow"
      >
        <p style="font-size:14px;line-height:24px;color:#666">
          名称：{{ infoWindow.data.name }}
        </p>
      </bm-info-window>
    </baidu-map>
  </div>
</template>

<script src="./App.js"></script>
<style>
.map {
  position: relative;
  width: 100%;
  height: 720px;
  margin-bottom: 20px;
}
</style>
