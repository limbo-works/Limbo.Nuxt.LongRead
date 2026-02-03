export default function useLongRead(key) {
	const state = useState(`longRead:${String(key)}`, () => ({
		targetListIndex: 0,
		targetLists: new Map(),
		activeTarget: null,
		lastActiveTarget: null,
	})).value;

	const controller = reactive({
		get activeTarget() {
			return state.activeTarget;
		},
		set activeTarget(value) {
			state.activeTarget = value;
		},

		get targetList() {
			return [...state.targetLists.values()].flat();
		},
	});

	return {
		controller,
		registerTargets,
	};

	// Targets should unwrap to either a DOM element or an array of DOM elements
	function registerTargets(targets) {
		const id = state.targetListIndex++;

		const unregisterWatcher = watch(() => toValue(targets), (targets) => {
			targets = (Array.isArray(targets) ? targets : [targets]).filter(Boolean);
			console.log('Registering targets for long read:', targets);
		}, { immediate: true, deep: true });

		// To follow the general convention of Vue, we return an unregister function
		return function unregisterTargets() {
			unregisterWatcher();
			state.targetLists.delete(id);
		};
	}
}
