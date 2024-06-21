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
