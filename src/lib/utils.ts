import Swal, { SweetAlertOptions } from "sweetalert2";

export async function showAlert(options: SweetAlertOptions) {
  return Swal.fire({
    icon: "info",
    reverseButtons: true,
    showCancelButton: true,
    confirmButtonColor: "#DC2626",
    ...options,
  });
}

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function parseFormData(
  form: FormData,
  key: string,
  shouldCapitalize = false
) {
  let string = form.get(key)?.toString().trim() ?? "";
  if (shouldCapitalize) {
    return capitalize(string);
  } else {
    return string;
  }
}
