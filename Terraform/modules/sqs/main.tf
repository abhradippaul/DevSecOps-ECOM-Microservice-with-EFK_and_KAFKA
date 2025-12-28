resource "aws_sqs_queue" "this_queue" {
  name                      = "${var.sqs_name}-sqs"
  delay_seconds             = 0
  max_message_size          = 2048
  message_retention_seconds = 3600
  receive_wait_time_seconds = 10

  tags = {
    Environment = var.env
  }
}

data "aws_iam_policy_document" "this" {
  statement {
    sid    = "First"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["sns.amazonaws.com"]
    }

    actions   = ["sqs:SendMessage"]
    resources = [aws_sqs_queue.this_queue.arn]

    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values   = [var.sns_arn]
    }
  }
}

resource "aws_sqs_queue_policy" "this" {
  queue_url = aws_sqs_queue.this_queue.id
  policy    = data.aws_iam_policy_document.this.json
}

resource "aws_sns_topic_subscription" "user_updates_sqs_target" {
  topic_arn            = var.sns_arn
  protocol             = "sqs"
  endpoint             = aws_sqs_queue.this_queue.arn
  raw_message_delivery = true

  filter_policy = jsonencode({
    service = ["${var.sqs_name}"]
  })
}
