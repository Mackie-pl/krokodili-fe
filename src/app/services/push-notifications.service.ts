import { PushNotifications } from '@capacitor/push-notifications';
import Parse, { Installation } from 'parse';
import { Device } from '@capacitor/device';

// class MyInstallation extends Installation {
// 	override set(key: any, value: any) {
// 		if (key === 'deviceType') {
// 			return super.set(key, 'android');
// 		}
// 		return super.set(key, value);
// 	}
// }

// class MyInstCont extends InstallationController {
// 	override getInstallation() {
// 		return MyInstallation;
// 	}
// }

export const addListeners = async () => {
	await PushNotifications.addListener('registration', async (token) => {
		console.info('Registration token 2: ', token.value);

		const deviceInfo = await Device.getInfo();
		console.info('Device info: ', deviceInfo.platform);

		if (deviceInfo.platform === 'android') {
			Parse.Installation.DEVICE_TYPES.WEB = 'android';
		}
		const installation = await Parse.Installation.currentInstallation();
		installation.set('deviceToken', token.value);
		installation.set('GCMSenderId', '33003692568');
		(installation as any)['_get'] = installation.get;
		console.log('Output device 1:', installation.get('deviceType'));
		installation.get = (key: string) => {
			if (key === 'deviceType') {
				return 'android';
			}
			return (installation as any)['_get'](key);
		};
		console.log('Output device 2:', installation.get('deviceType'));
		await installation.save();
	});

	await PushNotifications.addListener('registrationError', (err) => {
		console.error('Registration error: ', err.error);
	});

	await PushNotifications.addListener(
		'pushNotificationReceived',
		(notification) => {
			console.log('Push notification received: ', notification);
		}
	);

	await PushNotifications.addListener(
		'pushNotificationActionPerformed',
		(notification) => {
			console.log(
				'Push notification action performed',
				notification.actionId,
				notification.inputValue
			);
		}
	);
};

export const registerNotifications = async () => {
	let permStatus = await PushNotifications.checkPermissions();

	if (permStatus.receive === 'prompt') {
		permStatus = await PushNotifications.requestPermissions();
	}

	if (permStatus.receive !== 'granted') {
		throw new Error('User denied permissions!');
	}

	await PushNotifications.register();
};

const getDeliveredNotifications = async () => {
	const notificationList =
		await PushNotifications.getDeliveredNotifications();
	console.log('delivered notifications', notificationList);
};
