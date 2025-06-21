import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function RequestForm() {
  const [requestType, setRequestType] = useState("")
  const [requestTitle, setRequestTitle] = useState("")
  const [requestDescription, setRequestDescription] = useState("")
  const [files, setFiles] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({
      requestType,
      requestTitle,
      requestDescription,
      files: files ? Array.from(files) : [],
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl font-semibold text-gray-800">Request Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Select value={requestType} onValueChange={setRequestType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Request Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="support">Support Request</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter Request Title"
                value={requestTitle}
                onChange={(e) => setRequestTitle(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Enter why you want to send Request..."
                value={requestDescription}
                onChange={(e) => setRequestDescription(e.target.value)}
                className="w-full min-h-[120px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload" className="text-sm text-gray-600 cursor-pointer">
                <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                  Submit Files (if needed)
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  className="hidden"
                />
              </Label>
              {files && files.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">{files.length} file(s) selected</div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              SUBMIT
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
