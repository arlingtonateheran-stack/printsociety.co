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
} from "lucide-react";

interface AccountSettingsProps {
  user: UserAccount;
  onSave?: (userData: Partial<UserAccount>) => void;
}

export function AccountSettings({ user, onSave }: AccountSettingsProps) {
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

  const handleSave = () => {
    onSave?.({
      ...formData,
      preferences,
    });
  };

  return (
    <div className="space-y-6">
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
            className="bg-green-600 hover:bg-green-700"
          >
            Save Changes
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
              <Button variant="outline">Verify</Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Verified on {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Button variant="outline" className="w-full md:w-auto">
              Change Password
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
          <Button variant="outline" size="sm" className="gap-2">
            <Plus size={16} />
            Add Address
          </Button>
        </div>

        <div className="space-y-3">
          {user.shippingAddresses.map((address) => (
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
                  <button className="p-1 text-gray-400 hover:text-blue-600 transition">
                    <Edit2 size={16} />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600 transition">
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
          ))}
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
            className="bg-green-600 hover:bg-green-700"
          >
            Save Preferences
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200 bg-red-50">
        <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>

        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
          <div>
            <p className="font-medium text-gray-900">Delete Account</p>
            <p className="text-sm text-gray-600">
              Permanently delete your account and all data
            </p>
          </div>
          <Button variant="outline" className="text-red-600 hover:text-red-700">
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
}
