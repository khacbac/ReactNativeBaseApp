import DefinedBuffer from "./js-serialize/DefinedBuffer";
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
} from "./js-serialize/DefinedType";
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

import HttpUtils from "./http/HttpUtils";
import ContentType from "./http/ContentType";
import MethodType from "./http/MethodType";
export { HttpUtils, ContentType, MethodType };

import AndroidSdk from "./AndroidSdk";
import IOSVersion from "./IOSVersion";
export { AndroidSdk, IOSVersion };

import Utils from "./Utils";
import PlatformOS from "./PlatformOS";
import Handler from "./utils/Handler";
export { Utils, Handler, PlatformOS };

import SQLiteUtils from "./sql/SQLiteUtils";
export { SQLiteUtils };

import ContentValues from "./sql/ContentValues";
import Cursor from "./sql/Cursor";
export { ContentValues, Cursor };


import ByteHelper from "./js-serialize/ByteHelper";
export { ByteHelper };

// ===================================================================================//
// ==================== Base component ============================//
import Dialog from "./ui/alert/Dialog";
import Text from "./ui/Text";
import Button from "./ui/Button";
import Image from "./ui/Image";
import CircleImage from "./ui/CircleImage";
import TextInput from "./ui/TextInput";
import CheckBox from "./ui/CheckBox";
import Radio from "./ui/Radio";
import RatingBar from "./ui/RatingBar";
import MultipleText from "./ui/MultipleText";
import ButtonIconOnMap from "./ui/ButtonIconOnMap";
import HorizontalIconInput from "./ui/HorizontalIconInput";
import HorizontalIconTextButton from "./ui/HorizontalIconTextButton";
import ITextInput from "./ui/model/ITextInput";
import RippleBackground from "./ui/RippleBackground";
import WithTextInput from "./ui/WithTextInput";
import LifeComponent from "./ui/LifeComponent";
import HttpView from "./ui/HttpView";
import Header, {HeaderType} from "./ui/header/Header";
import MenuHeader from "./ui/header/MenuHeader";
import BackHeader from "./ui/header/BackHeader";
import { ConnectionManager } from "./tcp/ConnectionManager";

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
  HeaderType,
  WithTextInput,
  RippleBackground,
  ITextInput
};

import NativeTcpModule from "./tcp/NativeTcpModule"
import TcpEventProcess from "./tcp/TcpEventProcess"

export { ConnectionManager, NativeTcpModule, TcpEventProcess }

import MediaManager from "./Media/MediaManager"
import MediaModule from "./Media/MediaModule"
export { MediaManager, MediaModule }

import UnitAlert from "./ui/alert/UnitAlert"
import PairAlert from "./ui/alert/PairAlert"
import AlertStyle from "./ui/alert/AlertStyle"
import IAlert from "./ui/alert/IAlert"
export { UnitAlert, PairAlert, AlertStyle, IAlert }

import ViewState from "./model/ViewState"
export { ViewState }


import OnTcpEventListener from "./location/OnLocationEventListener"
import ConnectionResult from "./location/ConnectionResult"
import Location from "./location/Location"

import FusedLocation from "./location/FusedLocation"
import FusedLocationModule from "./location/FusedLocationModule"
import GpsConfig from "./location/GpsConfig"
import GpsStatus from "./location/GpsStatus"
import WaitGpsDialog from "./location/WaitGpsDialog"
export { OnTcpEventListener, ConnectionResult, Location, FusedLocation, FusedLocationModule, GpsConfig, GpsStatus,WaitGpsDialog }

import UserUtils from './utils/UserUtils';
export { UserUtils }

import NativeLinkModule from "./base/NativeLinkModule";
import NativeEventProcess from "./base/NativeEventProcess";
import ActivityResultModule from "./base/ActivityResultModule";
import LifeCycleModule, { LifecycleEventListener } from "./base/LifeCycleModule";
import ToastModule from "./base/ToastModule";
import FileModule from "./base/FileModule";
import NativeAppModule from "./base/NativeAppModule";
import DatePickerModule from "./base/DatePickerModule";
export { NativeLinkModule, NativeEventProcess, ActivityResultModule, LifeCycleModule, LifecycleEventListener, ToastModule, FileModule, NativeAppModule, DatePickerModule }

import AlertModel from "./ui/alert/priority/AlertModel"
import AlertLayout from "./ui/alert/priority/AlertLayout"
export { AlertModel, AlertLayout }


import MarkerOptions from "./maps/MarkerOptions";
import LoadingMap from "./maps/LoadingMap";
import PolygonOptions from "./maps/PolygonOptions";
import PolylineOptions from "./maps/PolylineOptions";
import PaddingMap from "./maps/PaddingMap";
import MarkerInfoWindow from "./maps/MarkerInfoWindow";
export { MarkerOptions, LoadingMap, PolygonOptions, PolylineOptions, PaddingMap, MarkerInfoWindow }


