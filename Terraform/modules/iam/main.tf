data "aws_iam_policy_document" "sqs_queue_policy" {
  policy_id = "arn:aws:sqs:us-west-2:123456789012:user_updates_queue/SQSDefaultPolicy"

  statement {
    sid    = "user_updates_sqs_target"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["sns.amazonaws.com"]
    }

    actions = [
      "SQS:SendMessage",
    ]

    resources = [
      "arn:aws:sqs:us-west-2:123456789012:user-updates-queue",
    ]

    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"

      values = [
        aws_sns_topic.user_updates.arn,
      ]
    }
  }
}
