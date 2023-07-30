import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Alert, Switch, TouchableOpacity, PermissionsAndroid, Image, Modal, Button, Dimensions } from 'react-native';
import { Text, TextInput } from "@react-native-material/core";
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { FAB } from 'react-native-paper';
import Sign from '../components/Sign'
import CarCheckIn from '../components/CarCheckin';
import { useToast } from '../hooks/useToast';
import { CustomerReported, CustomerReached, UpdateService, ReachedService, EndService, ServiceLoaded, ReachedDropOffLocn, VehicleUnloaded, ReadyForHandover } from '../hooks/ApiList';
import { Slider } from 'react-native-range-slider-expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera } from 'react-native-image-picker';
// import Geolocation from '@react-native-community/geolocation';
import useAuth from "../hooks/useAuth";
import CarCheckin from '../components/CarCheckin';
import { LoaderContext } from "../hooks/Context/LoaderContext";
import base64Image from '../components/base64Image'
import SignatureScreen from 'react-native-signature-canvas'
import Geolocation from '@react-native-community/geolocation';




const ServiceERA = ({ route }) => {

    const { datas } = route?.params || {};
    const [tsrNo, setTsrNo] = useState(datas?.TSR_NOM)
    const [reachedKM, setReachedKM] = useState(datas?.TSR_TRP_REACH_KM)
    const [status, setStatus] = useState(datas?.TSR_STATUS)
    const [email, setEmail] = useState(datas?.TSR_MEM_EMAIL);
    const [tsrSysID, setTsrSysId] = useState(datas?.TSR_SYS_ID);
    const [srvsys_id, Setsrvsys_id] = useState(datas?.TSR_SRV_SYS_ID);
    const [startKM, setStartKM] = useState(datas?.TSR_TRP_START_KM);
    const [client, setClient] = useState(datas?.TSR_CL_NAME);
    const [custName, setCustName] = useState(datas?.TSR_MEM_NAME)
    const [idType, setIdType] = useState(datas?.TSR_MEM_ID_TYPE);
    const [name, setName] = useState(datas?.TSR_SRV_NAME);
    const [idNo, setIdNo] = useState(datas?.TSR_MEM_ID_NO);
    const [make, setMake] = useState(datas?.TSR_VH_MK_CODE);
    const [model, setModel] = useState(datas?.TSR_VH_MDL_CODE);
    const [mobNo, setMobNo] = useState(datas?.TSR_MEM_MOB_NO_1);
    const [regnNo, setRegnNo] = useState(datas?.TSR_VH_REG_NO);
    const [chassisNo, setChassisNo] = useState(datas?.TSR_VH_CHS_NO);
    const [pickUpLocn, setPickupLocation] = useState(datas?.TSR_TRP_FRM_DETS);
    const [dropOffLocn, setDropOffLocation] = useState(datas?.TSR_TRP_TO_DETS);
    const [garageName, setGarageName] = useState(datas.TSR_GRG_NAME);
    const [garageContactNo, setGarageContactNo] = useState(datas.TSR_GRG_CTCT_NO);
    const [remarks, setRemarks] = useState(datas.TSR_REMARKS);
    const [customerRemarks, setCustomerRemarks] = useState(datas.TSR_MEM_REMARKS);
    const [driverRemarks, setDriverRemarks] = useState(datas.TSR_DRV_REMARKS);
    const [checkInBy, setCheckInBy] = useState(datas.TSR_CHECKIN_BY);
    const [checkOutBy, setCheckOutBy] = useState(datas.TSR_CHECKOUT_BY);
    const [regnCardSelected, setRegnCardSelected] = useState(false);
    const [keyRemoteSelected, SetKeyRemoteSelected] = useState(false)
    const [toolsJackHookSelected, setToolsJackHookSelected] = useState(false)
    const [regnCardEnabled, setRegnCardEnabled] = useState(false)
    const [keyRemoteEnabled, setKeyRemoteEnabled] = useState(false)
    const [toolsJackHookEnabled, setToolsJackHookEnabled] = useState(false)
    const [isEnabled, setIsEnabled] = useState(false);
    const [isEndModalVisible, setIsEndModalVisible] = useState(false);
    const [checkInSign, setCheckInSign] = useState(datas?.TSR_CHECKIN_SIGN)
    const [CheckOutSign, setCheckOutSign] = useState(null)
    const [CheckInScratches, setCheckInScratches] = useState(datas?.TSR_CHECKIN_SCRTCH)
    const [CheckOutScratches, setCheckOutScratches] = useState(null)
    const [isCheckInNoScratchChecked, setIsCheckInNoScratchChecked] = useState(false);
    const [isCheckOutNoScratchChecked, setisCheckOutNoScratchChecked] = useState(false);
    const [isCheckOutEnabled, setIsCheckOutEnabled] = useState(false)

    const [customerSign, setCustomerSign] = useState(null);
    const [inKm, setInKm] = useState(datas?.TSR_CHECKIN_KM)
    const [inFuel, setInFuel] = useState(datas.TSR_CHECKIN_FUEL)
    const [OutKm, setOutKm] = useState(datas?.TSR_CHECKOUT_KM)
    const [OutFuel, setOutFuel] = useState(datas.TSR_CHECKOUT_FUEL)
    const [reportVisible, setReportVisible] = useState(false);
    const [isCustomerReached, setIsCustomerReached] = useState(false);
    const [showRemainingFields, setShowRemainingFields] = useState(false);
    const [isReported, setIsReported] = useState(false);
    const [isVehicleUnloaded, setIsVehicleUnloaded] = useState(false);
    const [isReachedDropOffLocation, setIsReachedDropOffLocation] = useState(false);
    const [isReadyForHandover, setIsReadyForHandover] = useState(false);
    const signatureRef = useRef(null);
    const [signature, setSignature] = useState(null);
    const { showToast } = useToast();
    const [value, setValue] = useState(0);
    const navigation = useNavigation();
    const { vehId, uId } = useAuth();
    const { showLoader, hideLoader } = useContext(LoaderContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [scratches, setShowScratches] = useState(null)
    const multiLocn = datas.TSR_MULTI_LOCN_YN;
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const ref = useRef();
    const [tsrItems, setTSRItems] = useState([
        {
            itm_sys_id: tsrSysID,
            itm_seq_no: 0,
            itm_name: "Regn. Card",
            itm_code: "8",
            itm_yn: "N",
            itm_sys_yn: "N",
        },
        {
            itm_sys_id: tsrSysID,
            itm_seq_no: 0,
            itm_name: "Key/Remote",
            itm_code: "10",
            itm_yn: "N",
            itm_sys_yn: "N",
        },
        {
            itm_sys_id: tsrSysID,
            itm_seq_no: 0,
            itm_name: "Tools/Jack/Hook",
            itm_code: "11",
            itm_yn: "N",
            itm_sys_yn: "N",
        },
        {
            itm_sys_id: 4,
            itm_seq_no: 4,
            itm_name: " ",
            itm_code: "12",
            itm_yn: "N",
            itm_sys_yn: "N",
        },
        {
            itm_sys_id: 5,
            itm_seq_no: 5,
            itm_name: " ",
            itm_code: "13",
            itm_yn: "N",
            itm_sys_yn: "N",
        },
        {
            itm_sys_id: 6,
            itm_seq_no: 6,
            itm_name: " ",
            itm_code: "14",
            itm_yn: "N",
            itm_sys_yn: "N",
        },
        {
            itm_sys_id: 7,
            itm_seq_no: 7,
            itm_name: " ",
            itm_code: "15",
            itm_yn: "N",
            itm_sys_yn: "N",
        },
    ]);
    const DataUrl = `data:image/png;base64,${base64Image}`;

    console.log("ST_CODE", datas.TSR_ST_CODE);
    console.log("MAKE", make);
    Geolocation.getCurrentPosition(
        position => {
            setLatitude(position.coords.latitude)
            setLongitude(position.coords.longitude)
        },
        error => console.log('Error:', error.message),
        {
            enableHighAccuracy: true, // Optional, set to true if you want to use GPS for more accurate results.
            timeout: 20000, // Optional, set the maximum time (in milliseconds) to wait for a location update.
            maximumAge: 1000, // Optional, set the maximum age (in milliseconds) of a cached location.
        }
    );


    const handleSliderChangeInFuel = (value) => {
        setInFuel(value);
    };
    const handleSliderChangeOutFuel = (value) => {
        setOutFuel(value);
    };

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
    };

    const handleReachedKMChange = async (value) => {
        setReachedKM(value);
    };

    console.log("status--------------->", status);


    const handleReachedKMSubmit = async () => {
        if (reachedKM !== "") {
            setReportVisible(true);
            console.log("tsrSysID", tsrSysID);
            try {
                showLoader();
                const response = await ReachedService(
                    `strGPSLat=${latitude}&strGPSLng=${longitude}`,
                    {
                        driver_id: uId,
                        vehicle_id: vehId,
                        sys_id: tsrSysID,
                        srv_sys_id: srvsys_id,
                        reach_km: reachedKM,
                        pickup_locn: pickUpLocn,
                        dropoff_locn: dropOffLocn,
                        start_km: startKM,
                    }
                );

                if (response.status === 200) {
                    showToast("Saved successfully", "success");
                } else {
                    showToast("Please Enter Reached KM", "error");
                }
            } catch (error) {
                console.error("Error occurred while saving:", error);
                showToast("Error occurred while saving", "error");
            } finally {
                hideLoader();
            }
        }
    };


    const handleReport = () => {
        Alert.alert('Reported', 'Has the service been reported to the customer?', [
            { text: 'No', onPress: () => saveReport(false) },
            {
                text: 'Yes', onPress: () => {
                    saveReport(true)
                }

            }
        ]);
    };
    const saveReport = async () => {
        try {
            showLoader()
            const { IsSuccess } = await CustomerReported(`intTSRSysId=${tsrSysID}&uid=${uId}&veh_id=${vehId}`);
            if (IsSuccess) {
                showToast('Reported', 'success');
                console.log('saved successfully');

                setIsCustomerReached(true)
            } else {
                // Error occurred while saving the signature
                console.error('Failed to save');
            }
        } catch (error) {
            console.error('Error occurred while saving:', error);
        }
        finally {
            hideLoader();
        }

    };

    const handleCustomerReached = () => {
        Alert.alert('Customer Reached?', 'Is the customer present at the location', [
            { text: 'No', onPress: () => saveCustomerReached(false) },
            {
                text: 'Yes', onPress: () => {

                    setShowRemainingFields(false);
                    saveCustomerReached(true)
                }

            }
        ]);
        const saveCustomerReached = async () => {
            try {
                showLoader()
                const IsSuccess = await CustomerReached(`intTSRSysId=${tsrSysID}&uid=${uId}&veh_id=${vehId}`)
                if (IsSuccess) {
                    showToast('saved successfully', 'success');

                    console.log('saved successfully');
                } else {
                    // Error occurred while saving the signature
                    console.error('Failed to save');
                }
            } catch (error) {
                console.error('Error occurred while saving:', error);
            }
            finally {
                hideLoader();
            }
        }


    };


    const handleToggle = (itemIndex, key) => {
        setTSRItems(prevItems => {
            const updatedItems = [...prevItems];
            const item = updatedItems[itemIndex];
            const newValue = item[key] === "Y" ? "N" : "Y"; // Toggle the value of the key
            item[key] = newValue;

            if (key === "itm_yn") {
                item.itm_sys_yn = newValue; // Make itm_sys_yn have the same behavior as itm_yn
                item.itm_yn = newValue === "N" ? "X" : "Y"; // Update itm_tn based on itm_sys_yn value
            }

            let seqNo = 1;
            updatedItems.forEach(item => {
                item.itm_seq_no = seqNo;
                seqNo++;
            });

            return updatedItems;
        });
    };

    const handleInputChange = (itemIndex, value) => {
        setTSRItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[itemIndex].itm_name = value;
            return updatedItems;
        });
    };


    // const handleToggleChange = (itemName, codeName,) => {
    //   const newItem = {
    //     itm_sys_id: tsrSysID,
    //     itm_seq_no: tsrItems.length + 1,
    //     itm_name: itemName,
    //     itm_code: codeName,
    //     itm_yn: "X",
    //     itm_sys_yn: "Y",
    //   };
    //   setTSRItems((prevItems) => [...prevItems, newItem]);
    //   console.log("tsritems", tsrItems);
    // };

    const handleLoad = async () => {
        try {
            showLoader()
            const response = await ServiceLoaded(`intTSRSysId=${tsrSysID}&uid=${uId}&veh_id=${vehId}`)

            if (response.IsSuccess) {
                console.log('Service Loaded');
                showToast('Service Loaded', 'success');
                navigation.navigate("Dashboard")
            } else {
                showToast('Failed to load the Service', 'error');
            }
        } catch (error) {
            console.error('Error occurred while loading the service:', error);
            showToast('Error occurred while Loading the service', 'error');
        }
        finally {
            hideLoader();
        }
    }

    const handleReachedDropOffLocn = () => {

        Alert.alert('Reached Dropoff Location?', 'Reached', [
            { text: 'No', onPress: () => ReachedDropOffLocation(false) },
            {
                text: 'Yes', onPress: () => {

                    ReachedDropOffLocation(true)
                }

            }
        ]);
    }
    const ReachedDropOffLocation = async () => {

        try {
            showLoader()
            const IsSuccess = await ReachedDropOffLocn(`intTSRSysId=${tsrSysID}&uid=${uId}&veh_id=${vehId}`)
            if (IsSuccess) {
                showToast('saved successfully', 'success');
                console.log('saved successfully');
                setIsReachedDropOffLocation(true)
                setIsVehicleUnloaded(true)
            } else {
                // Error occurred while saving the signature
                console.error('Failed to save');
            }
        } catch (error) {
            console.error('Error occurred while saving:', error);
        }
        finally {
            hideLoader();
        }
    }

    const vehUnloaded = () => {

        Alert.alert('Reached Dropoff Location?', 'Reached', [
            { text: 'No', onPress: () => saveVehUnloaded(false) },
            {
                text: 'Yes', onPress: () => {

                    saveVehUnloaded(true)
                }

            }
        ]);
    }
    const saveVehUnloaded = async () => {

        try {
            showLoader()
            const IsSuccess = await VehicleUnloaded(`intTSRSysId=${tsrSysID}&uid=${uId}&veh_id=${vehId}`)
            if (IsSuccess) {
                showToast('saved successfully', 'success');
                setIsVehicleUnloaded(true)
                setIsReadyForHandover(true)
                console.log('saved successfully');
            } else {
                // Error occurred while saving the signature
                console.error('Failed to save');
            }
        } catch (error) {
            console.error('Error occurred while saving:', error);
        }
        finally {
            hideLoader();
        }
    }

    const readyForHandover = () => {

        Alert.alert('Ready for Handover?', 'Ready', [
            { text: 'No', onPress: () => saveReadyForHandover(false) },
            {
                text: 'Yes', onPress: () => {

                    saveReadyForHandover(true)
                }

            }
        ]);
    }

    const saveReadyForHandover = async () => {
        try {
            showLoader()
            const IsSuccess = await ReadyForHandover(`intTSRSysId=${tsrSysID}&uid=${uId}&veh_id=${vehId}`)
            if (IsSuccess) {
                showToast('saved successfully', 'success');
                console.log('saved successfully');
                setIsReadyForHandover(false)
                setIsCheckOutEnabled(true)

            } else {
                console.error('Failed to save');
            }
        } catch (error) {
            console.error('Error occurred while saving:', error);
        }
        finally {
            hideLoader();
        }
    }




    // ---------------CarCheckIn start--------------------   //
    const handleCarCheckInOK = (signature) => {
        console.log("sign", signature);
        // onOK(signature);
        setModalVisible(false)
        setShowScratches(signature)
        setCheckInScratches(signature)
        setCheckOutScratches(signature)
    };
    const handleCarClear = () => {
        ref.current.clearSignature();
    };
    const handleCarConfirm = () => {
        console.log("end");
        ref.current.readSignature();
    };
    const goBackChecKIn = () => {
        setModalVisible(false)
    }

    // ---------------CarCheckIn End-------------------- //

    const handleCheckInSignature = () => {
        setSignature(signature)
    }
    // ---------------------SAVE Button start---------------------

    console.log("inkm", inKm);

    const handleSubmit = async () => {
        const payload = {
            driver_id: uId,
            vehicle_id: vehId,
            srv_sys_id: srvsys_id,
            sys_id: tsrSysID,
            reach_km: reachedKM,
            pickup_locn: pickUpLocn,
            dropoff_locn: dropOffLocn,
            start_km: startKM,
            client,
            name,
            cust_mob_no: mobNo,
            chs_no: chassisNo,
            reg_no: regnNo,
            vh_make: {
                MK_NAME: make
            },
            vh_model: {
                MDL_NAME: model
            },
            cust_email: email,
            pickup_locn: pickUpLocn,
            dropoff_locn: dropOffLocn,
            cust_id_type: idType,
            cust_remarks: customerRemarks,
            drv_remarks: driverRemarks,
            sys_id: tsrSysID,
            tsr_items_in: tsrItems,
            tsr_items_out: [],
            start_km: startKM,
            checkin_fuel: inFuel,
            checkin_km: inKm,
            checkout_km: OutKm,
            checkout_fuel: OutFuel,
            cust_id_type: idType,
            cust_id_no: idNo,
            trip_no: tsrNo,
            checkin_scratch: CheckInScratches,
            checkout_scratch: CheckOutScratches,
            checkin_sign: checkInSign,
            checkin_by: checkInBy,
            checkin_nomarks: (isCheckInNoScratchChecked ? "Y" : "N"),
        }
        try {
            const response = await UpdateService(payload)
            if (response.IsSuccess) {
                console.log('Form data saved successfully');
                showToast('Form data saved successfully', 'success');
                navigation.navigate("Dashboard")
            } else {
                showToast('Failed to save form data', 'error');
            }
        } catch (error) {
            console.error('Error occurred while saving form data:', error);
            showToast('Error occurred while saving form data', 'error');
        }

    };

    // ---------------------SAVE Button end---------------------
    const handleBlur = () => {
        if (idNo.length < 6) {
            Alert.alert('ID No. must be at least 6 characters long.');
        } else {
            handleSubmit();
        }
    }
    // ---------------------END Button start---------------------
    const handleEnd = async () => {

        const payload = {
            driver_id: uId,
            vehicle_id: vehId,
            srv_sys_id: srvsys_id,
            sys_id: tsrSysID,
            name,
            client,
            reach_km: reachedKM,
            cust_id_no: datas.TSR_MEM_ID_NO,
            checkin_by: datas.TSR_CHECKIN_BY,
            checkout_by: "test",
            start_km: startKM,
            client,
            trip_no: tsrNo,
            name,
            mobNo,
            chs_no: "22",
            reg_no: regnNo,
            make,
            model,
            cust_email: email,
            pickup_locn: pickUpLocn,
            dropoff_locn: dropOffLocn,
            cust_id_type: idType,
            cust_remarks: customerRemarks,
            drv_remarks: driverRemarks,
            sys_id: tsrSysID,
            tsr_items_in: tsrItems,
            tsr_items_out: [],
            cust_name: custName,
            cust_mob_no: mobNo,
            salik_cnt: 0,
            end_km: 3500,
            cust_id_type: idType,
            cust_id_no: idNo,
            checkin_sign: "signature",
            checkout_sign: "customerSign",
            checkin_REGN: 'test',
            checkin_km: inKm,
            checkout_km: OutKm,
            checkin_fuel: inFuel,
            checkout_fuel: OutFuel,
            checkin_by: checkInBy,
            checkout_by: checkOutBy,
            checkin_sign: checkInSign,
            checkin_scratch: "string",
            checkout_scratch: CheckOutScratches,

            checkin_nomarks:isCheckInNoScratchChecked,
            checkout_nomarks: (datas?.TSR_CHECKOUT_MRK_YN == 'Y' ? true : false),

        }

        try {

            const response = await EndService("strGPSLat=232323&strGPSLng=232323", payload)

            if (response.IsSuccess) {
                console.log('Service Ended');
                showToast('Service Ended', 'success');
                navigation.navigate("Dashboard")
            } else {
                showToast('Failed to End the Service', 'error');
            }
        } catch (error) {
            console.error('Error occurred while Ending the service:', error);
            showToast('Error occurred while Ending the service', 'error');
        }
    }
    // ---------------------END Button end---------------------
    console.log("tssrNOOO", datas.TSR_NO);

    //----------------Camera Start-----------------------//
    const insets = useSafeAreaInsets();

    const captureImage = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: 'Camera Permission',
                message:
                    'This app needs access to your camera ' +
                    'so you can take pictures.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            const options = {
                title: 'Select Image',
                mediaType: 'photo',
                quality: 1,
                maxWidth: 500,
                maxHeight: 500,
                includeBase64: true,
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                },
            };

            launchCamera(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    // const source = { uri: `data:${response.assets[0].type};base64,${response.assets[0].base64}` };
                    // setCapturedImage(source);
                    // setCapturedImageBase64(`data:${response.assets[0].type};base64,${response.assets[0].base64}`);
                }
            });
        }
    };

    //----------------Camera End-----------------------//

    const handleSignature = (signature) => {
        setCheckInSign(signature)
    }

    return (
        <>

            {/* -----------Drawer Header Start---------- */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#ff5f00',
                    paddingTop: insets.top,
                    height: 86, // Adjust the height as needed 
                }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginHorizontal: 10 }}>
                    <Icon
                        name={'chevron-left'}
                        size={33}
                        color="#fff"
                    />
                </TouchableOpacity>
                <>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 7 }}>
                        <TouchableOpacity style={{ paddingHorizontal: 13, paddingVertical: 5 }}
                            onPress={() => navigation.navigate('Logs', { tsrSysID })}
                        >
                            <Icon name="message" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            // onPress={captureImage}
                            onPress={() => navigation.navigate('ServiceImage', { tsrSysID })}
                            style={{ paddingHorizontal: 15, paddingVertical: 5 }}>
                            <Icon name="camera" size={24} color="#fff" />
                        </TouchableOpacity>
                        {((status === "REACHED") || (status === "LOADED") || (status === "ONGOING")) &&
                            <TouchableOpacity onPress={handleSubmit} style={{ marginHorizontal: 5, marginVertical: 2, borderColor: '#fff', borderWidth: 1, borderRadius: 1 }}>
                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', paddingHorizontal: 12, paddingVertical: 4, }} >SAVE</Text>
                            </TouchableOpacity>}
                        {((status === "LOADED") || (status === "ONGOING")) &&
                            <TouchableOpacity onPress={handleEnd} style={{ marginHorizontal: 5, marginVertical: 2, borderColor: '#fff', borderWidth: 1, borderRadius: 2 }}>
                                <Text style={{ color: '#fff', fontSize: 16, paddingHorizontal: 12, paddingVertical: 4, fontWeight: 'bold', }} >END</Text>
                            </TouchableOpacity>}
                    </View>
                </>
            </View>
            {/* -----------Drawer Header End---------- */}

            <ScrollView styles={{ marginBottom: 50 }}>
                <View style={styles.container}>
                    <View style={styles.column}>
                        <TextInput
                            variant="standard"
                            label="Trip Sheet No"
                            value={(datas.TSR_NO).toString()}
                            editable={false}
                            style={styles.dinput}
                        />
                    </View>
                    <View style={styles.column}>
                        <TextInput
                            variant="standard"
                            label="Start KM"
                            value={startKM.toString()}
                            editable={false}
                            style={styles.dinput}
                        />
                        <TextInput
                            variant="standard"
                            label="Reached KM"
                            value={reachedKM ? reachedKM.toString() : ""}
                            editable={(value !== "") ? true : false}
                            onChangeText={handleReachedKMChange}
                            onEndEditing={handleReachedKMSubmit}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.column}>
                        <TextInput
                            variant="standard"
                            label="Client"
                            value={client}
                            editable={false}
                            style={styles.dinput}
                        />
                    </View>
                    <View style={styles.column}>
                        <TextInput
                            variant="standard"
                            label="Name"
                            value={name}
                            editable={false}
                            style={styles.dinput}
                        />
                    </View>
                    <View style={styles.column}>
                        <TextInput
                            variant="standard"
                            label="Mobile"
                            value={mobNo}
                            onChangeText={setMake}
                            style={styles.dinput}
                        />
                    </View>
                    <View style={styles.column}>
                        <TextInput
                            variant="standard"
                            label="Make"
                            value={make}
                            editable={false}
                            style={styles.dinput}
                        />
                        <TextInput
                            variant="standard"
                            label="Model"
                            value={model}
                            onChangeText={setModel}
                            editable={false}
                            style={styles.dinput}
                        />
                    </View>
                    <View style={styles.column}>
                        <TextInput
                            variant="standard"
                            label="Chasis No."
                            value={chassisNo}
                            onChangeText={setChassisNo}
                            editable={false}
                            style={styles.dinput}
                        />
                    </View>
                    <View style={styles.column}>
                        <TextInput
                            variant="standard"
                            label="Remarks"
                            value={remarks}
                            onChangeText={setRemarks}
                            multiline
                            numberOfLines={3}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.column}>
                        <TextInput
                            variant="standard"
                            label="Customer Remarks"
                            value={customerRemarks}
                            onChangeText={setCustomerRemarks}
                            multiline
                            numberOfLines={3}
                            style={styles.input}
                        />
                    </View>
                    {(status !== "STARTED") && (
                        <>
                            <View style={styles.column}>
                                <TextInput
                                    variant="standard"
                                    label="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    style={styles.input}
                                />
                            </View>
                            <View style={styles.column}>
                                <View style={styles.inputContainer}>
                                    <Picker
                                        variant="standard"
                                        selectedValue={idType}
                                        onValueChange={(itemValue) => setIdType(itemValue)}
                                        style={styles.input}
                                    >
                                        <Picker.Item label="ID Type" value="Type" disabled />
                                        <Picker.Item label="Emirates ID" value="Emirates ID" />
                                        <Picker.Item label="Driving License" value="Driving License" />
                                        <Picker.Item label="Labour Card" value="Labour Card" />
                                        <Picker.Item label="Passport" value="Passport" />
                                    </Picker>
                                    <View style={styles.inputLine} />
                                </View>
                                <TextInput
                                    variant="standard"
                                    label="ID No."
                                    value={idNo}
                                    onChangeText={setIdNo}
                                    onBlur={handleBlur}
                                    style={styles.input}
                                />
                            </View>
                            <View style={styles.column}>
                                <TextInput
                                    variant="standard"
                                    label="Regn. No."
                                    value={regnNo}
                                    onChangeText={setRegnNo}
                                    style={styles.input}
                                />
                                <TextInput
                                    variant="standard"
                                    label="Chassis No."
                                    value={chassisNo}
                                    onChangeText={setChassisNo}
                                    style={styles.input}
                                />
                            </View>
                            <View style={styles.column}>
                                <TextInput
                                    variant="standard"
                                    label="Pickup Location"
                                    value={pickUpLocn}
                                    onChangeText={setPickupLocation}
                                    style={styles.input}
                                />
                            </View>
                            <View style={styles.column}>
                                <TextInput
                                    variant="standard"
                                    label="Drop Off Location"
                                    value={dropOffLocn}
                                    onChangeText={setDropOffLocation}
                                    style={styles.input}
                                />
                            </View>
                            <View style={styles.column}>
                                <TextInput
                                    variant="standard"
                                    label="Garage Name"
                                    value={garageName}
                                    onChangeText={setGarageName}
                                    style={styles.input}
                                />
                                <TextInput
                                    variant="standard"
                                    label="Garage Contact No."
                                    value={garageContactNo}
                                    onChangeText={setGarageContactNo}
                                    style={styles.input}
                                />
                            </View>

                            <View style={styles.column}>
                                <TextInput
                                    variant="standard"
                                    label="Driver Remarks"
                                    value={driverRemarks}
                                    onChangeText={setDriverRemarks}
                                    multiline
                                    numberOfLines={3}
                                    style={styles.input}
                                />
                            </View>

                            {/* ----------Check IN Start------------- */}
                            <View>
                                <Text variant='h6'>CHECK-IN</Text>
                                <Text variant='body1' style={styles.disclaimer}>
                                    Vehicle received in condition as in where is Damaged / Wrecked / Broken down. IMC will not be responsible for any claims or damages reported once the vehicle is handed over and duly signed by the customer or anyone on behalf of the customer. IMC will not be responsible for any valuables or belongings left inside the vehicle.
                                </Text>

                                <View style={{ padding: 10 }} pointerEvents={isCheckInNoScratchChecked  ? 'none' : 'auto'}>

                                {/* <View> */}
                                    <TouchableOpacity onPress={toggleModal}>
                                        {CheckInScratches ? (
                                            <Image
                                                style={styles.image}
                                                resizeMode="contain"
                                                source={{ uri: `${CheckInScratches}` }}
                                            />
                                        ) : (
                                            <Image style={styles.image} resizeMode="contain"
                                                source={require('../assets/Images/carph1.jpg')}
                                            />
                                        )}
                                    </TouchableOpacity>

                                    <Modal
                                        visible={modalVisible}
                                        animationType="slide"
                                        onRequestClose={() => setModalVisible(false)}
                                    >
                                        <SignatureScreen
                                            ref={ref}
                                            style={styles.sign}
                                            onOK={handleCarCheckInOK}
                                            dataURL={CheckInScratches ? CheckInScratches : DataUrl}
                                            webStyle={`
                                                .m-signature-pad {
                                                background-color: transparent;
                                                position: fixed;
                                                margin: auto; 
                                                top: 0; 
                                                width: 100%;
                                                height: 100%;
                                                }
                                            `}
                                        />

                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity onPress={handleCarConfirm} style={styles.button}>
                                                <Text style={styles.buttonText}>Confirm</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={handleCarClear} style={styles.button}>
                                                <Text style={styles.buttonText}>Clear</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.button}>
                                                <Text style={styles.buttonText} onPress={goBackChecKIn}>Back</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Modal>

                                </View>
                                <View style={styles.toggleNoScratchContainer}>
                                    <Text style={styles.label}>No Scratches</Text>
                                    <Switch
                                        value={isCheckInNoScratchChecked}
                                        onValueChange={(value) => {
                                            setIsCheckInNoScratchChecked(value)
                                            if (value) {
                                                setCheckInScratches(null)
                                            }
                                        }

                                        }
                                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                                        thumbColor={isCheckInNoScratchChecked ? '#f5dd4b' : '#f4f3f4'}

                                    />
                                </View>



                                {tsrItems.map((item, index) => (
                                    <View key={item.itm_sys_id} style={styles.toggleContainer}>
                                        <TextInput
                                            style={[styles.input, index < 3 ? styles.disabledInput : null]}
                                            value={item.itm_name}
                                            onChangeText={value => handleInputChange(index, value)}
                                            placeholder={`Item ${index + 4}`}
                                            editable={index >= 3} // Disable first three inputs
                                        />
                                        <Switch
                                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                                            thumbColor={item.itm_yn === 'Y' ? '#f5dd4b' : '#f4f3f4'}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={() => handleToggle(index, 'itm_yn')}
                                            value={item.itm_yn === 'Y'}
                                        />
                                    </View>
                                ))}

                                <View style={styles.column}>
                                    <TextInput
                                        variant="standard"
                                        label="In Km"
                                        value={inKm ? inKm.toString() : inKm}
                                        onChangeText={setInKm}
                                        style={styles.input}
                                    />

                                    <Text>In Fuel  - </Text><Text  >{inFuel}</Text>
                                    <Slider
                                        min={0}
                                        max={9}
                                        valueOnChange={handleSliderChangeInFuel}
                                        initialValue={inFuel}
                                        knobColor='#ff9800'
                                        showValueLabels={false}
                                        showRangeLabels={false}
                                        style={styles.input}
                                    />

                                </View>
                                <View>
                                    <Text variant='body1' style={styles.disclaimer1}>
                                        Vehicle received by IMC in above conditon
                                    </Text>
                                </View>
                                <View >
                                    <View style={styles.column}>
                                        <TextInput
                                            variant="standard"
                                            label="Name (Check-In)"
                                            value={checkInBy}
                                            onChangeText={setCheckInBy}
                                            style={styles.input}
                                        />

                                    </View>
                                    {checkInSign ?

                                        <Image

                                            style={styles.image}
                                            resizeMode="contain"
                                            source={{ uri: `${checkInSign}` }}
                                        />

                                        :

                                        <Sign checkInSign={handleSignature} />}

                                </View>
                            </View>
                            {/* ----------Check IN Ends------------- */}



                            {/* ----------Check out Start------------- */}
                            {/* {!(isCheckOutEnabled) ?

                                (<View>
                                    <Text variant='h6'  >CHECK-OUT</Text>
                                    <Text variant='body1' style={styles.disclaimer}>
                                        Vehicle received in condition as in where is Damaged / Wrecked / Broken down. IMC will not be responsible for any claims or damages reported once the vehicle is handed over and duly signed by the customer or anyone on behalf of the customer. IMC will not be responsible for any valuables or belongings left inside the vehicle.
                                    </Text>
                                    <View >
                                        <View>
                                            <TouchableOpacity onPress={toggleModal}>
                                                {scratches ? (
                                                    <Image
                                                        style={styles.image}
                                                        resizeMode="contain"
                                                        source={{ uri: `${scratches}` }}
                                                    />
                                                ) : (
                                                    <Image style={styles.image}
                                                        resizeMode="contain"
                                                        source={require('../assets/Images/carph1.jpg')}
                                                    />
                                                )}
                                            </TouchableOpacity>

                                            <Modal
                                                visible={modalVisible}
                                                animationType="slide"
                                                onRequestClose={() => setModalVisible(false)}
                                            >
                                                <SignatureScreen
                                                    ref={ref}
                                                    style={styles.sign}
                                                    onOK={handleCarCheckInOK}
                                                    dataURL={DataUrl}
                                                    webStyle={`
                                                    .m-signature-pad {
                                                    background-color: transparent;
                                                    position: fixed;
                                                    margin: auto; 
                                                    top: 0; 
                                                    width: 100%;
                                                    height: 100%;
                                                    }
                                                `}
                                                />

                                                <View style={styles.buttonContainer}>
                                                    <TouchableOpacity onPress={handleCarConfirm} style={styles.button}>
                                                        <Text style={styles.buttonText}>Confirm</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={handleCarClear} style={styles.button}>
                                                        <Text style={styles.buttonText}>Clear</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </Modal>
                                        </View>
                                        <View style={styles.toggleNoScratchContainer}>
                                            <Text style={styles.label}>No Scratches</Text>
                                            <Switch
                                                value={isNoScratchChecked}
                                                onValueChange={(value) => setisCheckOutNoScratchChecked(value)}
                                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                                thumbColor={isCheckOutNoScratchChecked ? '#f5dd4b' : '#f4f3f4'}
                                            />
                                        </View>
                                        {tsrItems.map((item, index) => (
                                            <View key={item.itm_sys_id} style={styles.toggleContainer}>
                                                <TextInput
                                                    style={[styles.input, index < 3 ? styles.disabledInput : null]}
                                                    value={item.itm_name}
                                                    onChangeText={value => handleInputChange(index, value)}
                                                    placeholder={`Item ${index + 4}`}
                                                    editable={index >= 3} // Disable first three inputs
                                                />
                                                <Switch
                                                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                                                    thumbColor={item.itm_yn === 'Y' ? '#f5dd4b' : '#f4f3f4'}
                                                    ios_backgroundColor="#3e3e3e"
                                                    onValueChange={() => handleToggle(index, 'itm_yn')}
                                                    value={item.itm_yn === 'Y'}
                                                />
                                            </View>
                                        ))}
                                        <View style={styles.column}>
                                            <TextInput
                                                variant="standard"
                                                label="Out Km"
                                                value={OutKm}
                                                onChangeText={setOutKm}
                                                style={styles.input}
                                            />

                                            <Text>Out Fuel</Text>
                                            <Slider
                                                min={0}
                                                max={9}
                                                valueOnChange={handleSliderChangeOutFuel}
                                                initialValue={OutFuel}
                                                knobColor='#ff9800'
                                                showValueLabels={false}
                                                showRangeLabels={false}
                                                style={styles.input}
                                            />
                                            <Text>{OutFuel}</Text>
                                        </View>
                                        <Text variant='body1' style={styles.disclaimer1}>
                                            Vehicle handed over by IMC in above conditon

                                        </Text>
                                    </View>
                                    <View style={styles.section}>
                                        <View>
                                            <TextInput
                                                variant="standard"
                                                label="Name (Check-Out)"
                                                style={styles.input}
                                                value={checkOutBy}
                                                onChangeText={setCheckOutBy}
                                            />

                                        </View>
                                        <Sign onOK={signature} />
                                    </View>
                                </View>)
                                : ""
                            } */}

                            {/* ----------Check Out Ends------------- */}
                        </>
                    )
                    }

                </View >
            </ScrollView >
            {(status === "STARTED") && (datas?.TSR_CUST_REPORTED !== "Y") && (
                <FAB
                    icon="account"
                    label="REPORTED"
                    color='white'
                    onPress={handleReport}
                    style={styles.fabStyle}
                />
            )
            }
            {
                ((isCustomerReached) || ((datas?.TSR_CUST_REPORTED === "Y") && (datas?.TSR_RCHD_YN !== "Y"))) && (
                    <FAB
                        icon="account"
                        label="CUSTOMER REACHED"
                        color='white'
                        onPress={handleCustomerReached}
                        style={styles.fabStyle}
                    />
                )
            }
            {
                status === "ONGOING" && (multiLocn === "Y") && (
                    <FAB
                        icon="truck"
                        label="LOADED"
                        color='white'
                        onPress={handleLoad}
                        style={styles.fabStyle}
                    />
                )
            }
            {
                ((status === "LOADED") && (datas?.TSR_REACHED_DROPOFF === "N") && (multiLocn === "Y")) && (
                    <FAB
                        icon="map-marker"
                        color='white'
                        label="REACHED DROPOFF LOCATION"
                        onPress={handleReachedDropOffLocn}
                        style={styles.fabStyle}
                    />
                )
            }
            {
                ((status === "LOADED") && (datas?.TSR_REACHED_DROPOFF === "Y") && (datas?.TSR_VH_UNLOADED === "N") && (multiLocn === "Y")) && (
                    <FAB
                        icon="truck-fast"
                        label="VEHICLE UNLOADED"
                        color='white'
                        onPress={vehUnloaded}
                        style={styles.fabStyle}
                    />
                )
            }
            {
                ((status === "LOADED") && (datas?.TSR_VH_UNLOADED === "Y") && (datas?.TSR_HOVR_READY === "N") && (multiLocn === "Y")) && (
                    <FAB
                        icon="check-all"
                        label="READY FOR HANDOVER"
                        color='white'
                        onPress={readyForHandover}
                        style={styles.fabStyle}
                    />
                )
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 13,
        paddingTop: 32,
    },
    toggleContainer: {
        flexDirection: 'row', // To display TextInput and Switch in a row
        alignItems: 'center', // To center them vertically
        justifyContent: 'space-between', // To evenly distribute them horizontally
        // paddingHorizontal: 16,
        paddingVertical: 8,

    },
    toggleNoScratchContainer: {
        flexDirection: 'row', // To display TextInput and Switch in a row
        alignItems: 'center', // To center them vertically
        justifyContent: 'flex-end', // To evenly distribute them horizontally
        // paddingHorizontal: 16,
        paddingVertical: 8,

    },
    column: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    columnLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
    },
    carImage: {
        width: 300,
        height: 200,
    },
    canvasContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 300,
        height: 200,
    },
    image: {
        width: Dimensions.get('window').width - 20,
        height: Dimensions.get('window').height * .4,
        // height: "50%",
        // width: "100%"
    },
    input: {
        flex: 1,
        marginRight: 8,
        backgroundColor: 'white',
        width: 250,
    },
    dinput: {
        flex: 1,
        marginRight: 8,
        backgroundColor: '#f2f2f2',
        width: 250,
    },
    inputInKm: {
        flex: 3,
        marginRight: 8,
        backgroundColor: 'white',
        alignContent: 'center',
    },
    button: {
        backgroundColor: '#ff9800',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    disclaimer: {
        color: 'red',
        marginVertical: 10,
    },
    disclaimer1: {
        color: 'black',
        marginVertical: 10,
    },
    signatureContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    signatureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    signature: {
        width: 500,
        height: 250,
    },
    saveButton: {
        backgroundColor: '#ff9800',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginTop: 16,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    inputContainer: {
        flex: 1,
        position: 'relative',
    },
    inputLine: {
        position: 'absolute',
        bottom: 6,
        left: 0,
        right: 7,
        height: 1,
        backgroundColor: 'gray',
    },
    label: {
        fontWeight: 'bold',
        marginRight: 10
        // float: "right"
        // marginBottom: 4,
    },
    fab: {
        width: "100%",
        height: 56,
        borderRadius: 28,
        backgroundColor: '#ff5f00',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabLabel: {
        color: 'white'

    },
    fabStyle: {
        position: 'absolute',
        bottom: 10, // Align FAB at the top of the screen
        right: 10,
        backgroundColor: '#ff5f00',
        zIndex: 1000,
        // paddingHorizontal: 0,
        elevation: 9,
        shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: -7
        //     }

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    signatureContainer: {
        paddingTop: 10,
        width: "100%",
        height: "40%",
    },
    signatureWrapper: {
        flex: 1,
        borderWidth: 2,
        borderColor: "#ccc",
        borderRadius: 5,
        overflow: "hidden",
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
    },

});

export default ServiceERA;
