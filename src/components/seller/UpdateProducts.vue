<script setup>
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { defineProps, defineEmits, ref, watch } from "vue";

const props = defineProps({
  isOpen: Boolean,
  mode: {
    type: String,
    default: "add",
    validator: (value) => ["add", "edit"].includes(value),
  },
  product: {
    type: Object,
    default: () => ({
      title: "",
      category: "",
      description: "",
      price: 0,
      stock: 0,
      thumbnail: "",
    }),
  },
});

const emit = defineEmits(["close", "save"]);

//initiallise form data from props based on mode
const formData = ref({
  title: props.mode === "edit" ? props.product.title : "",
  category: props.mode === "edit" ? props.product.category : "",
  description: props.mode === "edit" ? props.product.description : "",
  price: props.mode === "edit" ? props.product.price : 0,
  stock: props.mode === "edit" ? props.product.stock : 0,
});

// Ref for thumbnail file upload (new file to be sent to backend)
const thumbnailFile = ref(null);

// Preview URL for uploaded thumbnail (for display purposes only)
const thumbnailPreview = ref("");

// Track existing thumbnail for edit mode (to display)
const existingThumbnail = ref(
  props.mode === "edit" ? props.product.thumbnail : ""
);

// Watch for changes in props.product or mode to update form data
watch(
  () => [props.mode, props.product],
  ([newMode, newProduct]) => {
    if (newMode === "edit" && newProduct) {
      formData.value = {
        title: newProduct.title || "",
        category: newProduct.category || "",
        description: newProduct.description || "",
        price: newProduct.price || 0,
        stock: newProduct.stock || 0,
      };
      existingThumbnail.value = newProduct.thumbnail || "";
      thumbnailFile.value = null;
      thumbnailPreview.value = "";
    } else {
      formData.value = {
        title: "",
        category: "",
        description: "",
        price: 0,
        stock: 0,
      };
    }
    existingThumbnail.value = "";
    thumbnailFile.value = null;
    thumbnailPreview.value = "";
  },
  { immediate: true }
);

//handle additional images file selection
const handleThumbnailChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    thumbnailFile.value = file;
    thumbnailPreview.value = URL.createObjectURL(file); // Generate preview URL for display
  }
};
//Remove thumbnail (either new or existing)
const removeThumbnail  = () => {
  thumbnailFile.value = null;
  thumbnailPreview.value = "";
  existingThumbnail.value = ""; // Clear existing thumbnail if removed
};

const handleSubmit = () => {
  // Prepare data to send to parent
  const submissionData = {
    ...formData.value,
    thumbnailFile: thumbnailFile.value, // New thumbnail file if uploaded
  };
  emit("save", { mode: props.mode, data:submissionData });
};
const closeModal = () => {
  //clean up to prevent memory leaks
  thumbnailPreview.value = "";
  emit("close");
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-10 overflow-y-auto"
  >
    <div class="w-[70vw] h-fit bg-white rounded-lg shadow-lg p-6 relative mt-20">
      <h2 class="text-2xl font-semibold mb-4">Add a Product</h2>
      <XMarkIcon
        @click="closeModal"
        class="h-6 w-6 absolute top-2 right-2 text-black cursor-pointer"
      />
      <!-- Modal content goes here -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label
            for="title"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Title</label
          >
          <input
            v-model="formData.title"
            type="text"
            class="w-full p-2 border rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
            required
            :placeholder="mode === 'add' ? 'Enter product title' : ''"
          />
        </div>
        <div>
          <label
            for="category"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Category</label
          >
          <input
            v-model="formData.category"
            type="text"
            class="w-full p-2 border rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
            required
            :placeholder="mode === 'add' ? 'Enter category' : ''"
          />
        </div>
        <div>
          <label
            for="price"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Price</label
          >
          <input
            v-model.number="formData.price"
            type="number"
            step="0.01"
            min="0"
            class="w-full p-2 border rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <div>
          <label
            for="stock"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Stock</label
          >
          <input
            v-model.number="formData.stock"
            type="number"
            min="0"
            class="w-full p-2 border rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <!-- -------------------------IMAGES---------------------------------------------------- -->
         <div>
          <label for="thumbnail" class="block text-sm font-medium text-gray-700 mb-1"
            >Thumbnail Image</label
          >
          <input
            type="file"
            accept="image/*"
            @change="handleThumbnailChange"
            class="w-full p-2 border rounded-md border-gray-300 shadow-sm"
            :required="mode === 'add' && !existingThumbnail"
          />
          <div
            v-if="thumbnailPreview || existingThumbnail"
            class="mt-2 relative inline-block"
          >
            <img
              :src="thumbnailPreview || existingThumbnail"
              alt="Thumbnail Preview"
              class="h-20 w-20 object-cover rounded-md border border-gray-200"
            />
            <button
              type="button"
              @click="removeThumbnail"
              class="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-800"
            >
              ×
            </button>
          </div>
        </div>
           <!-- ----------------------------------------------------------------------------- -->
        <button
          type="submit"
          class="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
        >
          {{ mode === "add" ? "Add Product" : "Save Changes" }}
        </button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
