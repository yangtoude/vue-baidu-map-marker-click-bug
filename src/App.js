const isAssert = false;

import mockStation from "./mock/mock-station.json";
import mockCell from "./mock/mock-cell.json";
import mockStationAndCell from "./mock/mock-station-cell.json";

const anchor2Icon = require("@/assets/img/aiops/anchor2.png");
const anchor2IconCenter = require("@/assets/img/aiops/blueanchor2.png");
const circleIcon = require("@/assets/img/aiops/bluecircle18-2.png");
const circleIconCenter = require("@/assets/img/aiops/bluecircle18.png");

const circleIconMapv = new Image();
circleIconMapv.src = circleIcon;

const circleIconMapvCenter = new Image();
circleIconMapvCenter.src = circleIconCenter;

const anchor2IconMapv = new Image();
anchor2IconMapv.src = anchor2Icon;

const anchor2IconMapvCenter = new Image();
anchor2IconMapvCenter.src = anchor2IconCenter;

export default {
  name: "App",
  data() {
    return {
      typeCheck: {
        station: ["11", "4", "3", "5", "2", "1"],
        cell: ["12", "9", "8", "10", "7", "6"]
      },
      initCenter: "贵阳",
      markers: [],
      infoWindow: {
        show: false,
        data: {}
      }
    };
  },
  methods: {
    loadStationAndCell() {
      setTimeout(() => {
        if (mockStationAndCell.code === 0) {
          const sData = mockStationAndCell.data.all;
          const len = sData.length;

          this.setMarker(sData, len);
        }
      }, 300);
    },
    loadStation() {
      setTimeout(() => {
        if (mockStation.code === 0) {
          const sData = mockStation.data.all;
          const len = sData.length;

          this.setMarker(sData, len);
        }
      }, 300);
    },
    loadCell() {
      setTimeout(() => {
        if (mockCell.code === 0) {
          const sData = mockCell.data.all;
          const len = sData.length;

          this.setMarker(sData, len);
        }
      }, 300);
    },
    setMarker(sData, len) {
      if (Array.isArray(sData) && len > 0) {
        const sMarkers = this.getSafeMakers(sData, len);
        if (sMarkers.length > 0) {
          // 如果返回的小区中无中心点或中心点为空，则设置一个默认的中心点，列表中的第一个点
          this.initCenter = { lat: sMarkers[0].lat, lng: sMarkers[0].lng };
        } else {
        }

        this.markers = sMarkers;
      } else {
        this.markers = [];
      }
    },
    handleMapClick(obj) {
      console.assert(
        false,
        this.$options.name,
        "百度地图点击事件: ",
        obj.point
      );
    },
    // 过滤基站或小区列表
    getSafeMakers(list, len) {
      const sMarkers = [];
      for (let i = 0; i < len; i++) {
        const item = list[i];

        if (item.latitude !== null && item.longtitude !== null) {
          sMarkers.push({
            orignalLat: item.latitude,
            orignalLng: item.longtitude,
            lat: item.latBd09,
            lng: item.lonBd09,
            name: item.name,
            type: item.type,
            isCenter: item.isCenter,
            azimuth: item.azimuth
          });
        }
      }

      return sMarkers;
    },
    // 判断是否为小区
    isCell(type) {
      return this.typeCheck.cell.indexOf(type) !== -1;
    },
    // 根据类型，设置覆盖物图标
    getIcon(type, isCenter) {
      if (this.isCell(type)) {
        if (isCenter === 1) {
          // 置中小区
          return { url: anchor2IconCenter, size: { width: 24, height: 48 } };
        } else {
          // 不置中小区
          return { url: anchor2Icon, size: { width: 24, height: 48 } };
        }
      } else {
        if (isCenter === 1) {
          // 置中
          return { url: circleIconCenter, size: { width: 18, height: 18 } };
        } else {
          // 不置中基站
          return { url: circleIcon, size: { width: 18, height: 18 } };
        }
      }
    },
    // 根据方位角计算偏移
    getOffsetData(azimuth) {
      let x = 0;
      let y = 0;
      const halfCellHeight = 48 / 2;
      const radian = (azimuth * Math.PI) / 180;
      const PI2 = 2 * Math.PI;
      const halfPi = Math.PI / 2;
      const normalRadian = PI2 - (radian - halfPi); // 规范化为直角坐标系中的象限角

      if (
        azimuth !== null &&
        azimuth !== undefined &&
        typeof azimuth === "number" &&
        azimuth >= 0
      ) {
        x = halfCellHeight * Math.cos(normalRadian);
        y = -halfCellHeight * Math.sin(normalRadian);
      }

      // x正值向右移动，y正值向下移动
      return { width: x, height: y };
    },
    showInfoWindow(marker) {
      setTimeout(() => {
        this.infoWindow.data = marker;
        console.assert(
          isAssert,
          this.$options.name,
          "覆盖物信息：百度经纬度",
          { lng: marker.lng, lat: marker.lat },
          marker
        );
        this.openWindow();
      }, 500);
    },
    openWindow() {
      this.infoWindow.show = true;
    },
    closeWindow() {
      this.infoWindow.show = false;
    },
    // 根据方位角获取旋转角度
    getRotation(azimuth) {
      return azimuth !== null ? azimuth : 0;
    }
  }
};
