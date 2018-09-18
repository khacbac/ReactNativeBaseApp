import DefinedBuffer from "./module/js-serialize/DefinedBuffer";
export { DefinedBuffer };

import {
  AbstractDefineType,
  DfInteger,
  DataType,
  DfByte,
  DfShort,
  DfLong,
  DfFloat,
  DfDouble,
  DfBoolean,
  DfString,
  DfLatLng,
  DfNumberArray,
  LatLng,
  DfList,
  ISerialize,
  ISerializeItemArray
} from "./module/js-serialize/DefinedType";
export {
  AbstractDefineType,
  DfInteger,
  DataType,
  DfByte,
  DfShort,
  DfLong,
  DfFloat,
  DfDouble,
  DfBoolean,
  DfString,
  DfLatLng,
  DfNumberArray,
  LatLng,
  DfList,
  ISerialize,
  ISerializeItemArray
};

import HttpUtils from "./module/http/HttpUtils";
import ContentType from "./module/http/ContentType";
import MethodType from "./module/http/MethodType";
export { HttpUtils, ContentType, MethodType };

import AndroidSdk from "./module/AndroidSdk";
import IOSVersion from "./module/IOSVersion";
export { AndroidSdk, IOSVersion };

import Utils from "./module/Utils";
import PlatformOS from "./module/PlatformOS";
import Handler from "./module/utils/Handler";
export { Utils, Handler, PlatformOS };

import SQLiteUtils from "./module/sql/SQLiteUtils";
export { SQLiteUtils };

import ContentValues from "./module/sql/ContentValues";
import Cursor from "./module/sql/Cursor";
export { ContentValues, Cursor };


import ByteHelper from "./module/js-serialize/ByteHelper";
export { ByteHelper };

// ===================================================================================//
// ==================== Base component ============================//
import Dialog from "./module/ui/alert/Dialog";
import Text from "./module/ui/Text";
import Button from "./module/ui/Button";
import Image from "./module/ui/Image";
import CircleImage from "./module/ui/CircleImage";
import TextInput from "./module/ui/TextInput";
import CheckBox from "./module/ui/CheckBox";
import Radio from "./module/ui/Radio";
import RatingBar from "./module/ui/RatingBar";
import MultipleText from "./module/ui/MultipleText";
import ButtonIconOnMap from "./module/ui/ButtonIconOnMap";
import HorizontalIconInput from "./module/ui/HorizontalIconInput";
import HorizontalIconTextButton from "./module/ui/HorizontalIconTextButton";
import WithTextInput from "./module/ui/WithTextInput";
import LifeComponent from "./module/ui/LifeComponent";
import HttpView from "./module/ui/HttpView";
import Header, {HeaderType} from "./module/ui/header/Header";
import MenuHeader from "./module/ui/header/MenuHeader";
import BackHeader from "./module/ui/header/BackHeader";
import { ConnectionManager } from "./module/tcp/ConnectionManager";

export {
  Dialog,
  Text,
  Image,
  CircleImage,
  TextInput,
  Button,
  CheckBox,
  Radio,
  RatingBar,
  MultipleText,
  ButtonIconOnMap,
  HorizontalIconInput,
  HorizontalIconTextButton,
  HttpView,
  LifeComponent,
  Header,
  MenuHeader,
  BackHeader,
  HeaderType, WithTextInput
};

import NativeTcpModule from "./module/tcp/NativeTcpModule"
import TcpEventProcess from "./module/tcp/TcpEventProcess"

export { ConnectionManager, NativeTcpModule, TcpEventProcess }

import MediaManager from "./module/Media/MediaManager"
import MediaModule from "./module/Media/MediaModule"
export { MediaManager, MediaModule }

import UnitAlert from "./module/ui/alert/UnitAlert"
import PairAlert from "./module/ui/alert/PairAlert"
import AlertStyle from "./module/ui/alert/AlertStyle"
import IAlert from "./module/ui/alert/IAlert"
export { UnitAlert, PairAlert, AlertStyle, IAlert }

import ViewState from "./module/model/ViewState"
export { ViewState }


import OnTcpEventListener from "./module/location/OnLocationEventListener"
import ConnectionResult from "./module/location/ConnectionResult"
import Location from "./module/location/Location"
import FusedLocation from "./module/location/FusedLocation"
import FusedLocationModule from "./module/location/FusedLocationModule"
import GpsConfig from "./module/location/GpsConfig"
import GpsStatus from "./module/location/GpsStatus"
export { OnTcpEventListener, ConnectionResult, Location, FusedLocation, FusedLocationModule, GpsConfig, GpsStatus }

import UserUtils from './module/utils/UserUtils';
export { UserUtils }

import NativeLinkModule from "./module/base/NativeLinkModule";
import NativeEventProcess from "./module/base/NativeEventProcess";
import ActivityResultModule from "./module/base/ActivityResultModule";
import LifeCycleModule, { LifecycleEventListener } from "./module/base/LifeCycleModule";
import ToastModule from "./module/base/ToastModule";
import FileModule from "./module/base/FileModule";
import NativeAppModule from "./module/base/NativeAppModule";
import DatePickerModule from "./module/base/DatePickerModule";
export { NativeLinkModule, NativeEventProcess, ActivityResultModule, LifeCycleModule, LifecycleEventListener, ToastModule, FileModule, NativeAppModule, DatePickerModule }

import AlertModel from "./module/ui/alert/priority/AlertModel"
import AlertLayout from "./module/ui/alert/priority/AlertLayout"
export { AlertModel, AlertLayout }


import MarkerOptions from "./module/maps/MarkerOptions";
import LoadingMap from "./module/maps/LoadingMap";
import PolygonOptions from "./module/maps/PolygonOptions";
import PolylineOptions from "./module/maps/PolylineOptions";
import PaddingMap from "./module/maps/PaddingMap";
import MarkerInfoWindow from "./module/maps/MarkerInfoWindow";
export { MarkerOptions, LoadingMap, PolygonOptions, PolylineOptions, PaddingMap, MarkerInfoWindow }




