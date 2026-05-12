<script setup lang="ts">
const props = defineProps<{
	params: {
		value: string;
	};
}>();
</script>

<template>
	<span class="resin-empty-value">{{ props.params.value }}</span>
</template>

<style lang="scss">
.n8n-empty-value {
	font-style: italic;
	color: var(--color--text);
}
</style>
