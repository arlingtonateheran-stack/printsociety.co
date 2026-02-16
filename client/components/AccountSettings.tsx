import { useState } from "react";
import { UserAccount } from "@shared/account";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
} from "lucide-react";
import { AddressModal } from "./AddressModal";

interface AccountSettingsProps {
  user: UserAccount;
  onSave?: (userData: Partial<UserAccount>) => Promise<void>;
  onAddressSave?: (address: any) => Promise<void>;
  onAddressDelete?: (id: string) => Promise<void>;
  onVerifyEmail?: () => Promise<void>;
  onChangePassword?: () => Promise<void>;
  onDeleteAccount?: () => Promise<void>;
}

export function AccountSettings({
  user,
  onSave,
  onAddressSave,
  onAddressDelete,
  onVerifyEmail,
  onChangePassword,
  onDeleteAccount
}: AccountSettingsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone || "",
    company: user.company || "",
  });

  const [preferences, setPreferences] = useState(user.preferences);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.({
        ...formData,
        preferences,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditAddress = (address: any) => {
    setSelectedAddress({
      ...address,
      firstName: address.firstName || user.firstName,
      lastName: address.lastName || user.lastName,
      phone: address.phone || user.phone || "",
      addressType: address.addressType || 'shipping'
    });
    setShowAddressModal(true);
  };

  const handleAddAddress = () => {
    setSelectedAddress(null);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      setIsDeleting(true);
      try {
        await onAddressDelete?.(id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleAddressSave = async (address: any) => {
    await onAddressSave?.(address);
  };

  const handleVerifyEmail = async () => {
    setIsVerifying(true);
    try {
      await onVerifyEmail?.();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChangePassword = async () => {
    setIsChangingPassword(true);
    try {
      await onChangePassword?.();
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      setIsDeletingAccount(true);
      try {
        await onDeleteAccount?.();
      } finally {
        setIsDeletingAccount(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSave={handleAddressSave}
        address={selectedAddress}
      />
      <div>
        <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
        <p className="text-gray-600">
          Manage your profile information and preferences
        </p>
      </div>

      {/* Personal Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User size={20} />
          Personal Information
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) => handleFormChange("firstName", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <Input
                value={formData.lastName}
                onChange={(e) => handleFormChange("lastName", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <Input
              value={formData.company}
              onChange={(e) => handleFormChange("company", e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => handleFormChange("phone", e.target.value)}
              type="tel"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>

      {/* Email & Security */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lock size={20} />
          Email & Security
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="flex gap-2">
              <Input value={user.email} disabled className="bg-gray-50" />
              <Button
                variant="outline"
                onClick={handleVerifyEmail}
                disabled={isVerifying}
              >
                {isVerifying ? "Sending..." : "Verify"}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Account created on {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Button
              variant="outline"
              className="w-full md:w-auto"
              onClick={handleChangePassword}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Sending Reset Email..." : "Change Password"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Shipping Addresses */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin size={20} />
            Shipping Addresses
          </h3>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleAddAddress}
          >
            <Plus size={16} />
            Add Address
          </Button>
        </div>

        <div className="space-y-3">
          {user.shippingAddresses.length === 0 ? (
            <p className="text-sm text-gray-500 italic py-4 text-center border-2 border-dashed rounded-lg">
              No shipping addresses saved yet.
            </p>
          ) : (
            user.shippingAddresses.map((address) => (
              <Card key={address.id} className="p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      {address.label}
                      {address.isDefault && (
                        <span className="ml-2 inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                          Default
                        </span>
                      )}
                    </h5>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-1 text-gray-400 hover:text-blue-600 transition"
                      onClick={() => handleEditAddress(address)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-red-600 transition disabled:opacity-50"
                      onClick={() => handleDeleteAddress(address.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-700">{address.street}</p>
                {address.street2 && (
                  <p className="text-sm text-gray-700">{address.street2}</p>
                )}
                <p className="text-sm text-gray-700">
                  {address.city}, {address.state} {address.zipCode}
                </p>
                <p className="text-sm text-gray-700">{address.country}</p>
              </Card>
            ))
          )}
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell size={20} />
          Notification Preferences
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">
                Receive general account notifications
              </p>
            </div>
            <Checkbox
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) =>
                handlePreferenceChange("emailNotifications", checked === true)
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">
                Proof Approval Reminders
              </p>
              <p className="text-sm text-gray-600">
                Get reminders about pending proof approvals
              </p>
            </div>
            <Checkbox
              checked={preferences.proofApprovalReminders}
              onCheckedChange={(checked) =>
                handlePreferenceChange(
                  "proofApprovalReminders",
                  checked === true
                )
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Order Updates</p>
              <p className="text-sm text-gray-600">
                Track your orders from production to delivery
              </p>
            </div>
            <Checkbox
              checked={preferences.orderUpdates}
              onCheckedChange={(checked) =>
                handlePreferenceChange("orderUpdates", checked === true)
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Marketing Emails</p>
              <p className="text-sm text-gray-600">
                Promotions, new products, and company news
              </p>
            </div>
            <Checkbox
              checked={preferences.marketingEmails}
              onCheckedChange={(checked) =>
                handlePreferenceChange("marketingEmails", checked === true)
              }
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200 bg-red-50">
        <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
          <AlertTriangle size={20} />
          Danger Zone
        </h3>

        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
          <div>
            <p className="font-medium text-gray-900">Delete Account</p>
            <p className="text-sm text-gray-600">
              Permanently delete your account and all data
            </p>
          </div>
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleDeleteAccount}
            disabled={isDeletingAccount}
          >
            {isDeletingAccount ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
