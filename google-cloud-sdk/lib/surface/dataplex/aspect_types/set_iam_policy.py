# -*- coding: utf-8 -*- #
# Copyright 2024 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""`gcloud dataplex aspect-types set-iam-policy-binding` command."""

from __future__ import absolute_import
from __future__ import division
from __future__ import unicode_literals

from googlecloudsdk.api_lib.dataplex import aspect_type
from googlecloudsdk.api_lib.util import exceptions as gcloud_exception
from googlecloudsdk.calliope import base
from googlecloudsdk.command_lib.dataplex import resource_args
from googlecloudsdk.command_lib.iam import iam_util


@base.ReleaseTracks(base.ReleaseTrack.ALPHA)
class SetIamPolicy(base.Command):
  """Set an IAM policy binding for a Dataplex Aspect Type as defined in a JSON or YAML file.

  See https://cloud.google.com/iam/docs/managing-policies for details of
    the policy file format and contents.
  """
  detailed_help = {
      'EXAMPLES':
          """\

          The following command will read an IAM policy defined in a JSON file
          `policy.json` and set it for the Dataplex Aspect Type `test-aspect-type` in
          project `test-project` and in location `us-central1`:

            $ {command} test-aspect-type --project=test-project --location=us-central1 policy.json

            where policy.json is the relative path to the JSON file.

          """,
  }

  @staticmethod
  def Args(parser):
    resource_args.AddDataplexAspectTypeResourceArg(
        parser, 'to set IAM policy to.'
    )
    iam_util.AddArgForPolicyFile(parser)

  @gcloud_exception.CatchHTTPErrorRaiseHTTPException(
      'Status code: {status_code}. {status_message}.'
  )
  def Run(self, args):
    aspect_type_ref = args.CONCEPTS.aspect_type.Parse()
    result = aspect_type.AspectTypeSetIamPolicyFromFile(
        aspect_type_ref, args.policy_file
    )
    return result
